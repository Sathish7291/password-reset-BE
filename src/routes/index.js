import express from 'express'
import UserRouter from './user.js'

const router = express.Router()

router.use('/user',UserRouter)
router.get('*',(req,res)=>res.send(`<div style="text-align:center"><h1>404 NOT FOUND</h1><p>The requested endpoint does not exists</p></div>`))
router.get('/',(req,res)=>{
    res.status(200),send(`<h1>Welcome to our Password Reset Backend`)
})

export default router
