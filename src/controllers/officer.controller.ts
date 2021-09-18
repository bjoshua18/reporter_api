import { Request, Response } from 'express'
import { Officer } from '../models'
import { handlerError } from '../utils/handlerError'
import { getResponse } from '../utils/utils'

export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const officers = await Officer.find()
    return getResponse(res, { data: officers })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function show(req: Request, res: Response): Promise<Response> {
  try {
    const officer = await Officer.findById(req.params.id)
    return officer
      ? getResponse(res, { data: officer })
      : OfficerNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function store(req: Request, res: Response): Promise<Response> {
  const { plate_number, name, department } = req.body
  try {
    const officer = new Officer({ plate_number, name, department })
    await officer.save()
    return getResponse(res, { data: officer, status: 'created', status_code: 201 })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  const { name, department } = req.body
  try {
    const officer = await Officer.findByIdAndUpdate(
      req.params.id,
      { name, department },
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
  try {
    const officer = await Officer.findByIdAndRemove(req.params.id)
    return officer
      ? getResponse(res, { data: officer })
      : OfficerNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

function OfficerNotFoundResponse(res: Response) {
  return getResponse(res, { error: 'Officer not found', status: 'not-found', status_code: 404 })
}
