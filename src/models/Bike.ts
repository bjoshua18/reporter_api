import { model, Schema, Document } from 'mongoose'
import { IOfficer } from './Officer'
import { Officer } from './index'

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

schema.post('save', async function (doc, next) {
  if (!doc.officer) {
    try {
      const officer = await Officer.findOne({ actual_case: null })
      if (officer) {
        doc.officer = officer.id
        await doc.save()

        officer.actual_case = doc.id
        await officer.save()
      }
    } catch (e) {
      console.error(e)
    } finally {
      next()
    }
  }
})

schema.post('save', async function (doc) {
  if (doc.status_case === 'closed') {
    try {
      const officer = await Officer.findById(doc.officer)
      if (officer) {
        const newCase = await Bike.findOne({ status_case: 'unsolved' })
        if (newCase) {
          officer.actual_case = newCase.id
          await officer.save()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
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

export default class Bike extends model<IBike>('Bike', schema) { }
