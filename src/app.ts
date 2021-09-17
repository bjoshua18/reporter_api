import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { bike } from "./routes";

const app = express()
dotenv.config()

// Settings
app.set('port', process.env.PORT || 3000)

// Middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/bikes', bike)

export default app
