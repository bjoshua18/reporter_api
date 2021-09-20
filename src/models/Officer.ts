import { model, Schema, Document } from 'mongoose'
import { IBike } from './Bike'
import { IDepartment } from './Department'
import { Department } from './index'

const schema = new Schema({
  plate_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  actual_case: { ref: 'Bike', type: Schema.Types.ObjectId, default: null },
  department: { ref: 'Department', type: Schema.Types.ObjectId, required: true }
})

schema.post('save', async function (doc) {
  try {
    const department = await Department.findById(doc.department)
    if (department) {
      department.officers.push(doc.id)
      department.save()
    }
  } catch (e) {
    console.error(e)
  }
})

export interface IOfficer extends Document {
  plate_number: string,
  name: string,
  actual_case?: IBike['_id']
  department: IDepartment['_id']
}

export default class Officer extends model<IOfficer>('Officer', schema) { }
