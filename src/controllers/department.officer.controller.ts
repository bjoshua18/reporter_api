import { Request, Response } from 'express'
import { Officer } from '../models'
import { handlerError } from '../utils/handlerError'
import { getResponse } from '../utils/utils'

export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const { department } = res.locals
    const officers = await department.officers
    return getResponse(res, { data: officers })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function show(req: Request, res: Response): Promise<Response> {
  const { department } = res.locals
  const officer = getOfficer(department, req.params.officer_id)
  return officer
    ? getResponse(res, { data: officer })
    : OfficerNotFoundResponse(res)
}

export async function store(req: Request, res: Response): Promise<Response> {
  const { department } = res.locals
  const { plate_number, name } = req.body
  try {
    const officer = new Officer({ plate_number, name, department: department.id })
    await officer.save()

    return getResponse(res, { data: officer, status: 'created', status_code: 201 })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  const { department } = res.locals
  const { name } = req.body
  try {
    const officer = await Officer.findOneAndUpdate(
      { id: req.params.officer_id, department: department.id},
      { name },
      { new: true }
    )
    return officer
      ? getResponse(res, { data: officer })
      : OfficerNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
  const { department } = res.locals
  try {
    const officer = await Officer.findOneAndRemove({ id: req.params.id, department: department.id })
    return officer
      ? getResponse(res, { data: officer })
      : OfficerNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

function getOfficer(department: { officers: typeof Officer[] }, officer_id: string) {
  return department.officers.find((o: any) => o.id === officer_id)
}

function OfficerNotFoundResponse(res: Response) {
  return getResponse(res, { error: 'Officer not found', status: 'not-found', status_code: 404 })
}
