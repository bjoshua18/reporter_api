import {model, Schema, Document, PopulatedDoc} from 'mongoose'
import {IBike} from "./Bike";
import {IDepartment} from "./Department";

const schema = new Schema({
  plate_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  in_case: { type: Boolean, required: true, default: false },
  actual_case: { ref: 'Bike', type: Schema.Types.ObjectId, default: null },
  department: { ref: 'Department', type: Schema.Types.ObjectId, required: true }
})

export interface IOfficer extends Document {
  plate_number: string,
  name: string,
  in_case: boolean,
  actual_case?: IBike['_id']
  department: IDepartment['_id']
}

export default model<IOfficer>('Officer', schema)
