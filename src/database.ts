import { connect } from 'mongoose'

export async function startConnection() {
  await connect(process.env.DB_URI || '')
    .then(() => console.log('Database is connected'))
    .catch(() => console.error('Error in database connection'))
}
