import express from 'express'
import userController from '../controller/user.js'

const router = express.Router()

router.post('/signup',userController.signup)
router.post('/login',userController.login)
router.post('/forget-password',userController.forgetPassword)
router.post('/reset-password/:randomString/:expitationTimestamp',userController.resetPassword)
router.get('/getallusers',userController.getAlluser)

export default router