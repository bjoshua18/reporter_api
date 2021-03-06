import { Response } from 'express'
import { getResponse } from './utils';

export const handlerError = (err: any, res: Response) => {
  return getResponse(res, {
    error: err.message,
    status: 'server-error',
    status_code: 500
  })
}
