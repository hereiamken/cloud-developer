import { Key } from "aws-sdk/clients/dynamodb";
export interface BlogItem {
  userId: string;
  blogId: string;
  createdAt: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl?: string;
}

export interface PageableBlogItems {
  blogItems: BlogItem[];
  lastEvaluatedKey: Key;
}
