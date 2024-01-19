import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { CreateBlogRequest } from "../../requests/CreateBlogRequest";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { createBlog } from "../../businessLayer/blogs";

const logger = createLogger("createBlog");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event: ", event);

    const userId = getUserId(event);
    const newBlog: CreateBlogRequest = JSON.parse(event.body);
    const newItem = await createBlog(newBlog, userId);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        item: newItem,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
