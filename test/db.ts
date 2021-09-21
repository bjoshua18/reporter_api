import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer;

export const connect = async () => {
  await mongoose.disconnect()
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri, {}, error => {
    if (error) console.error(error)
  })
}

export const close = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}

export const clear = async () => {
  const collections = mongoose.connection.collections
  for(const key in collections) {
    await collections[key].deleteMany({})
  }
}
