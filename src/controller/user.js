import userModel from '../modules/user.js';
import auth from '../common/auth.js';
import randomstring from 'randomstring';
import nodemailer from 'nodemailer';
import config from '../common/config.js';

const signup = async(req,res) => {
    try{
        let user = await userModel.findOne({email:req.body.email})
        if(!user)
        {
            req.body.password = await auth.hashData(req.body.password)
            await userModel.create(req.body)
            res.status(201).send({message:"User Created Successfully"})
        }
        else{
            res.status(400).send({message:`User with ${req.body.email} already exists!`})
        }
    }catch(error){
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const login = async(req,res) =>{
    try {
        let {email,password} = req.body
        let user = await userModel.findOne({email:email})
        if(user)
        {
            if(await auth.compareHash(user.password,password))
            {
                const user = await userModel.findOne({email:email},{password:0})
                res.status(201).send({
                    message:`user ${user.userName} is login successfully`,
                    user
                })
            } 
            else{
                res.status(404).send({
                    message:"Invalid Password"
                })
            } 
        }else{
            res.status(404).send({
                message:`User with ${email} is not Found please SignUp`
            })
        }
        
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const getAlluser = async(req,res) =>{
    try {
        let users = await userModel.find({},{_id:0})
        res.status(200).send({
            message:"Data Fetch Successfully",
            users
        })
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const forgetPassword = async(req,res) => {
    const {email} = req.body;
    try {
        let user = await userModel.findOne({email})
        if(user)
        {
            const randomString = randomstring.generate({
                length:10,
                charset:"alphanumeric"
            })
            const expitationTimestamp = Date.now() + 2* 60 * 1000

            console.log(expitationTimestamp)

            const resetLink = `${config.RESET_URL}/reset-password/${randomString}/${expitationTimestamp}`

            const transporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:config.EMAIL_ID,
                    pass:config.EMAIL_PASSWORD,
                }
            })

            const mailOptions ={
                from: config.EMAIL_ID,
                to: user.email,
                subject:"Password-Reset-Link",
                html:`
                <p> Dear ${user.userName} , </p>
                
                <p>Sorry to hear you’re having trouble logging into your account. We got a message that you forgot your password. If this was you, you can get right back into your account or reset your password now. </p>
                <p> Click the following Link to reset your password \n ${resetLink} </p>

                <p>If you didn’t request a login link or a password reset, you can ignore this message. </P>

                <p> Only people who know your account password or click the login link in this email can log into your account. </P>
                `
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(error)
                    res.status(500).send({
                        message:"Failed to send the password reset mail"
                    })
                }else{
                    console.log("password reset email sent"+ info.response)
                    res.status(201).send({
                        message:"password reset mail sent successfully"
                    })
                }
                user.randomString = randomString
                user.save()
                res.status(201).send({message:"Reset password mail sent successfully and randomstring update in db"})
            })
        }
        else{
            res.status(400).send({
                message:`user with ${req.body.email} is exists`
            })
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}


const resetPassword = async(req,res) =>{
    try {
        const {randomString,expitationTimestamp} = req.params

        const user = await userModel.findOne({randomString:randomString})
        if(!user || user.randomString !== randomString)
        {
            res.status(400).send({
                message:"Invalid RandomString"
            })
        }
        else{
            if(expitationTimestamp && expitationTimestamp<Date.now())
            {
                res.status(400).send({
                    message:"expirationTimestamp token has expired. Please request a new reset link."
                })
            }else{
                if(req.body.newPassword){
                    const newPassword = await auth.hashData(req.body.newPassword)

                    user.password = newPassword
                    user.randomString = null
                    await user.save()

                    res.status(201).send({
                        message:"Your new Password has been Updated"
                    })
                }
                else{
                    res.status(400).send({
                        message:"Invalid password provider"
                    })
                }
            }
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}


export default{
    signup,
    login,
    getAlluser,
    forgetPassword,
    resetPassword
}