import { Request, Response} from 'express'
import { Bike } from '../models'
import { handlerError } from '../utils/handlerError'

export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const bikes = await Bike.find()
    return res.status(200).json({ data: bikes })
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function show(req: Request, res: Response): Promise<Response> {
  try {
    const bike = await Bike.findById(req.params.id)
    return bike
      ? res.status(200).json({ data: bike, status: 'OK', status_code: 200 })
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
    return res.status(201).json({ data: bike, status: 'created', status_code: 201 })
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
      ? res.status(200).json({ data: updatedBike, status: 'OK', status_code: 200 })
      : BikeNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
  try {
    const bike = await Bike.findByIdAndRemove(req.params.id)
    return bike
      ? res.status(200).json({ data: bike, status: 'OK', status_code: 200 })
      : BikeNotFoundResponse(res)
  } catch (e) {
    return handlerError(e, res)
  }
}

function BikeNotFoundResponse(res: Response) {
  return res.status(404).json({ error: 'Bike report not found', status: 'not-found', status_code: 404 })
}
