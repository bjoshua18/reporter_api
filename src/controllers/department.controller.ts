import { Request, Response } from 'express'
import { Department } from '../models'
import { handlerError } from '../utils/handlerError'
import { getResponse } from '../utils/utils'

export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const departments = await Department.find()
    return getResponse(res, { data: departments })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function show(req: Request, res: Response): Promise<Response> {
  try {
    const department = await Department.findById(req.params.id)
    return department
      ? getResponse(res, { data: department })
      : DepartmentNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function store(req: Request, res: Response): Promise<Response> {
  const { code, name, address } = req.body
  try {
    const department = new Department({ code, name, address })
    await department.save()
    return getResponse(res, { data: department, status: 'created', status_code: 201 })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  const { name, address } = req.body
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { name, address },
      { new: true }
    )
    return updatedDepartment
      ? getResponse(res, { data: updatedDepartment })
      : DepartmentNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
  try {
    const department = await Department.findByIdAndRemove(req.params.id)
    return department
      ? getResponse(res, { data: department })
      : DepartmentNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

function DepartmentNotFoundResponse(res: Response) {
  return getResponse(res, { error: 'Department not found', status: 'not-found', status_code: 404 })
}
