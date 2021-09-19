import { NextFunction, Request, Response } from 'express'
import { Department } from '../models'
import { handlerError } from '../utils/handlerError'
import { getResponse } from '../utils/utils'

export async function getDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const department = await Department.findById(req.params.dep_id).populate('officers')
    if (department) {
      res.locals.department = department
      return next()
    }
    return getResponse(res, { error: 'Department not found', status: 'not-found', status_code: 404 })
  } catch (e) {
    handlerError(e, res)
  }
}
