import { Response } from 'express'

export const handlerError = (err: any, res: Response) => {
  return res.status(500).json({
    errors: [err.message]
  })
}
