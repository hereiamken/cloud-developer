import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { getUserId } from "../utils";
import { attachBlog } from "../../businessLayer/blogs";
import { createLogger } from "../../utils/logger";

const logger = createLogger("generateUploadUrl");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event: ", event);
    const userId = getUserId(event);
    const blogId = event.pathParameters.blogId;

    try {
      const url = await attachBlog(userId, blogId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url,
        }),
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
