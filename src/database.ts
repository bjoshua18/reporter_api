import { connect } from 'mongoose'

export function startConnection() {
  connect(process.env.DB_URI || '')
    .catch(err => console.error(err.message))
}
