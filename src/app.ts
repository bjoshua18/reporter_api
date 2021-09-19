import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { bike, department } from './routes'
import {startConnection} from './database'

const app = express()
dotenv.config()

// Settings
app.set('port', process.env.PORT || 3000)
startConnection()

// Middlewares
if (process.env.ENV !== 'test')
  app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/bikes', bike)
app.use('/api/departments', department)

export default app
