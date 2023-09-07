import * as uuid from "uuid";

import { BlogItem, PageableBlogItems } from "../models/BlogItem";
import { BlogAccess } from "../dataLayer/blogsAccess";
import { CreateBlogRequest } from "../requests/CreateBlogRequest";
import { AttachmentAccess } from "../fileLayer/attachmentAccess";
import { createLogger } from "../utils/logger";
import { UpdateBlogRequest } from "../requests/UpdateBlogRequest";

import { Key } from "aws-sdk/clients/dynamodb";

const blogAccess = new BlogAccess();
const attachmentAccess = new AttachmentAccess();
const logger = createLogger("blogs");

export async function getAllBlogs(
  userId: string,
  nextKey: Key,
  limit: number
): Promise<PageableBlogItems> {
  const items = await blogAccess.getAllBlogs(userId, nextKey, limit);

  for (let item of items.blogItems) {
    if (!!item["attachmentUrl"])
      item["attachmentUrl"] = attachmentAccess.getDownloadUrl(
        item["attachmentUrl"]
      );
  }

  return items;
}

export async function createBlog(
  createBlogRequest: CreateBlogRequest,
  userId: string
): Promise<BlogItem> {
  const blogId = uuid.v4();

  return await blogAccess.createBlog({
    userId,
    blogId,
    createdAt: new Date().toISOString(),
    ...createBlogRequest,
  } as BlogItem);
}

export async function deleteBlog(
  userId: string,
  blogId: string
): Promise<void> {
  // Delete attachment object from S3
  logger.info("delete S3 object", blogId);
  await attachmentAccess.deleteAttachment(blogId);

  // TODO: Remove a TODO item by id
  logger.info("delete Blog item", userId, blogId);
  await blogAccess.deleteBlog(userId, blogId);
}

export async function updateBlog(
  userId: string,
  blogId: string,
  updatedBlog: UpdateBlogRequest
): Promise<void> {
  const validBlog = await blogAccess.getBlog(userId, blogId);

  if (!validBlog) {
    throw new Error("404");
  }

  logger.info("Updating blog: ", userId, updatedBlog);
  return await blogAccess.updateBlog(userId, blogId, updatedBlog);
}

export async function attachBlog(
  userId: string,
  blogId: string
): Promise<string> {
  const validTodo = await blogAccess.getBlog(userId, blogId);

  if (!validTodo) {
    throw new Error("404");
  }

  const url = attachmentAccess.getUploadUrl(blogId);
  await blogAccess.updateAttachment(userId, blogId);
  return url;
}
