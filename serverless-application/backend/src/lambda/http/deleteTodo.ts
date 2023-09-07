import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLayer/todos'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    await deleteTodo(userId, todoId)

    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
