import { factory } from 'factory-bot'
import { Bike } from '../../src/models'

factory.define<Bike>('bike', Bike, {
  license_number: factory.sequence('Bike.license_number', n => `B${n}`),
  color: 'black',
  type: 'standard',
  owner_name: 'Test Owner',
  theft_description: 'Test description',
  address_theft: 'Thug street'
})
