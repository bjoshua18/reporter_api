import { model, Schema, Document } from 'mongoose'
import { IOfficer } from './Officer'

const schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  officers: [{ ref: 'Officer', type: Schema.Types.ObjectId }]
})

export interface IDepartment extends Document {
  code: string,
  name: string,
  address: string,
  officers: Array<IOfficer['_id']>
}

export default class Department extends model<IDepartment>('Department', schema) { }
