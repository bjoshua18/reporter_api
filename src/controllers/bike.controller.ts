import { Request, Response } from 'express'
import { Bike } from '../models'
import { handlerError } from '../utils/handlerError'
import { getResponse } from '../utils/utils'

export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const bikes = await Bike.find()
    return getResponse(res, { data: bikes })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function show(req: Request, res: Response): Promise<Response> {
  try {
    const bike = await Bike.findById(req.params.id)
    return bike
      ? getResponse(res, { data: bike })
      : BikeNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function store(req: Request, res: Response): Promise<Response> {
  const { license_number, color, type, owner_name, theft_description, address_theft } = req.body
  try {
    const bike = new Bike({
      license_number,
      color,
      type,
      owner_name,
      theft_description,
      address_theft
    })
    await bike.save()
    return getResponse(res, { data: bike, status: 'created', status_code: 201 })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  const { license_number, color, type, owner_name, theft_description, address_theft } = req.body
  try {
    const updatedBike = await Bike.findByIdAndUpdate(
      req.params.id,
      {
        license_number,
        color,
        type,
        owner_name,
        theft_description,
        address_theft
      },
      { new: true }
    )
    return updatedBike
      ? getResponse(res, { data: updatedBike })
      : BikeNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
  try {
    const bike = await Bike.findByIdAndRemove(req.params.id)
    return bike
      ? getResponse(res, { data: bike })
      : BikeNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function search(req: Request, res: Response): Promise<Response> {
  try {
    const bikes = await Bike.find(getFilter(req.query)).populate({ path: 'officer', populate: { path: 'department' } })
    return getResponse(res, { data: bikes })
  } catch (e) {
    return handlerError(e, res)
  }
}

function getFilter(query: any): Object {
  const { license_number, color, type, owner_name } = query
  const filter: any = { license_number, color, type, owner_name }
  Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key])
  return filter
}

function BikeNotFoundResponse(res: Response) {
  return getResponse(res, { error: 'Bike report not found', status: 'not-found', status_code: 404 })
}
