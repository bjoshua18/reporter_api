import { model, Schema, Document } from 'mongoose'

const schema = new Schema({
  license_number: { type: String, required: true },
  color: { type: String, required: true },
  type: { type: String, required: true },
  owner_name: { type: String, required: true },
  theft_description: { type: String, required: true },
  address_theft: { type: String, required: true },
  status_case: { type: String, required: true, default: 'unsolved' },
  createdAt: { type: Date, required: true, default: Date.now },
})

interface IBike extends Document {
  license_number: string,
  color: string,
  type: string,
  owner_name: string,
  theft_description: string,
  address_theft: string,
  status_case: string,
  createdAt: Date
}

export default model<IBike>('Bike', schema)
