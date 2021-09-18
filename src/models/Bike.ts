import {model, Schema, Document, PopulatedDoc} from 'mongoose'
import { IOfficer } from './Officer'

const schema = new Schema({
  license_number: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  type: { type: String, required: true },
  owner_name: { type: String, required: true },
  theft_description: { type: String, required: true },
  address_theft: { type: String, required: true },
  status_case: { type: String, required: true, default: 'unsolved' },
  createdAt: { type: Date, required: true, default: Date.now },
  officer: { ref: 'Officer', type: Schema.Types.ObjectId, default: null }
})

export interface IBike extends Document {
  license_number: string,
  color: string,
  type: string,
  owner_name: string,
  theft_description: string,
  address_theft: string,
  status_case: string,
  createdAt: Date,
  officer?: IOfficer['_id']
}

export default model<IBike>('Bike', schema)
