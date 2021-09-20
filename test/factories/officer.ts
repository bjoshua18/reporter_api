import { factory } from 'factory-bot'
import { Officer } from '../../src/models'

factory.define<Officer>('officer', Officer, {
  plate_number: factory.sequence('Officer.plate_number', n => `A${n}`),
  name: factory.sequence('Officer.name', n => `Officer ${n}`),
  department: factory.assoc('department', '_id')
})
