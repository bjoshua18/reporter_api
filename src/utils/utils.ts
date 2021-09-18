import { Response } from 'express'

export function getResponse(
  res: Response,
  { data, error, status = 'OK', status_code = 200 }: {
    data?: any,
    error?: string,
    status?: string,
    status_code?: number
  }
) {
  return res.status(status_code).json({ data, error, status, status_code })
}
