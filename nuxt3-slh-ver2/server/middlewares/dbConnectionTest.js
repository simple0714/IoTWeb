import db from '../models/index'

export const dbConnectionTest = async (req, res, next) => {
  try {
    await db.sequelize.authenticate()
    console.log('✅ Database connection has been established successfully.')
    next()
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)
    next(error)
  }
}