import { Request, Response } from 'express'
import { Bike } from '../models'

export async function index(req: Request, res: Response): Promise<Response> {
  // TODO: show all bike reports
  return res.json({ msg: "Show all bike reports" })
}

export async function show(req: Request, res: Response): Promise<Response> {
  // TODO: show a specific bike report
  return res.json({msg: 'Show your bike report'})
}

export async function store(req: Request, res: Response): Promise<Response> {
  // TODO: save a bike report
  return res.json({ msg: 'Bike report created successfully' })
}

export async function update(req: Request, res: Response): Promise<Response> {
  // TODO: update a bike report
  return res.json({msg: 'bike report updated'})
}

export async function destroy(req: Request, res: Response): Promise<Response> {
  // TODO: delete a bike report
  return res.json({msg: 'bike report deleted'})
}
