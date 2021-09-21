import { connect } from 'mongoose'

export function startConnection() {
  const uri = (process.env.ENV !== 'test')
    ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gpjrd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    : 'mongodb://localhost/reporter_api_test'
  connect(uri)
    .catch(err => console.error(err.message))
}
