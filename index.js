import express from 'express'
import appRoutes from './src/routes/index.js'
import 'dotenv/config'
import cors from'cors'

const app = express()

app.use(cors())

app.use(express.json())

app.use(appRoutes)

app.listen(process.env.PORT,()=>console.log("App listening PORT : "+process.env.PORT))