import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { deleteBlog } from "../../businessLayer/blogs";

const logger = createLogger("deleteBlog");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event: ", event);
    const userId = getUserId(event);
    const blogId = event.pathParameters.blogId;

    await deleteBlog(userId, blogId);

    return {
      statusCode: 200,
      body: "",
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
