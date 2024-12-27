import express from 'express'
import { dbConnectionTest } from '../middlewares/dbConnectionTest'

const app = express()

app.use(express.json()) 
app.use(dbConnectionTest)

console.log(` ✅ [Express API Ready] on Nuxt`)

// Nuxt Nitro에서 Express 미들웨어로 변환
export default fromNodeMiddleware(app)