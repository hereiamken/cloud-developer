import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { UpdateBlogRequest } from "../../requests/UpdateBlogRequest";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { updateBlog } from "../../businessLayer/blogs";

const logger = createLogger("updateBlog");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event: ", event);
    const userId = getUserId(event);
    const blogId = event.pathParameters.blogId;
    const updatedBlog: UpdateBlogRequest = JSON.parse(event.body);

    try {
      await updateBlog(userId, blogId, updatedBlog);

      return {
        statusCode: 201,
        body: "",
      };
    } catch (error) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error,
        }),
      };
    }
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
