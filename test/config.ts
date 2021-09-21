import dotenv from 'dotenv'
import { clear, close, connect } from './db'

before(async () => await connect())
beforeEach( async () => await clear())
after(async () => await close())

dotenv.config({ path: `${__dirname}/../.env.test` })
