import { factory } from 'factory-bot'
import { Department } from '../../src/models'

factory.define<Department>('department', Department, {
  code: factory.sequence('Department.code', n => `D${n}`),
  name: factory.sequence('Department.name', n => `Department ${n}`),
  address: 'Test Department City'
})
