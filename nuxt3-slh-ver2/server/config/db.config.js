export default {
  HOST: process.env.DB_HOST,
  PORT: 3306,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: "slh",
  dialect: "mysql",
  pool: {
    max: 20,
    min: 1,
    acquire: 30000,
    idle: 10000
  }
}