import * as AWS from "aws-sdk";
import { DocumentClient, Key } from "aws-sdk/clients/dynamodb";

import { BlogItem, PageableBlogItems } from "../models/BlogItem";
import { BlogUpdate } from "../models/BlogUpdate";

export class BlogAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly blogsTable = process.env.BLOGS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  async getBlog(userId: string, blogId: string): Promise<BlogItem> {
    const result = await this.docClient
      .get({
        TableName: this.blogsTable,
        Key: { userId, blogId },
      })
      .promise();

    return result.Item as BlogItem;
  }

  async getAllBlogs(
    userId: string,
    nextKey: Key,
    limit: number
  ): Promise<PageableBlogItems> {
    console.log("Getting all blogs of a user");

    const result = await this.docClient
      .query({
        TableName: this.blogsTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
        ScanIndexForward: false,
        Limit: limit,
        ExclusiveStartKey: nextKey,
      })
      .promise();

    const items = result.Items as BlogItem[];
    return { blogItems: items, lastEvaluatedKey: result.LastEvaluatedKey };
  }

  async createBlog(newItem: BlogItem): Promise<BlogItem> {
    await this.docClient
      .put({
        TableName: this.blogsTable,
        Item: newItem,
      })
      .promise();

    return newItem;
  }

  async deleteBlog(userId: string, blogId: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.blogsTable,
        Key: { userId, blogId },
      })
      .promise();
  }

  async updateBlog(
    userId: string,
    blogId: string,
    updatedBlog: BlogUpdate
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: this.blogsTable,
        Key: { userId, blogId },
        UpdateExpression: "set #name = :n, dueDate=:dueDate, done=:done",
        ExpressionAttributeValues: {
          ":n": updatedBlog.name,
          ":dueDate": updatedBlog.dueDate,
          ":done": updatedBlog.done,
        },
        ExpressionAttributeNames: { "#name": "name" },
        ReturnValues: "NONE",
      })
      .promise();
  }

  async updateAttachment(userId: string, blogId: string): Promise<void> {
    await this.docClient
      .update({
        TableName: this.blogsTable,
        Key: { userId, blogId },
        UpdateExpression: "set attachmentUrl=:a",
        ExpressionAttributeValues: {
          ":a": blogId,
        },
        ReturnValues: "NONE",
      })
      .promise();
  }
}

function createDynamoDBClient() {
  return new AWS.DynamoDB.DocumentClient();
}
