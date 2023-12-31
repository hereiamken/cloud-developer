/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateBlogRequest {
  name: string;
  dueDate: string;
  done: boolean;
}
