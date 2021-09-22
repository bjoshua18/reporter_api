import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { bike, department } from './routes'
import { queryToLowerCase } from './middlewares/utils'
import swaggerUI from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reporter API',
      version: '1.0.0',
      description: 'API to manage bike theft reports'
    },
    servers: [{ url: 'http://localhost:3000/api' }]
  },
  apis: [`${__dirname}/doc/**/*.yml`]
}

const specs = swaggerJsDoc(options)

const app = express()
dotenv.config()

// Settings
app.set('port', process.env.PORT || 3000)

// Middlewares
if (process.env.ENV !== 'test')
  app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(queryToLowerCase)

// Routes
app.use('/api/bikes', bike)
app.use('/api/departments', department)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

export default app
