import { NextFunction, Request, Response } from 'express'

export function queryToLowerCase(req: Request, res: Response, next: NextFunction) {
  for (let key in req.query)
    req.query[key.toLowerCase()] = req.query[key]
  next()
}
