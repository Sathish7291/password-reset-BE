import mongoose from "mongoose";
import config from "../common/config.js";
import userController from './user.js'

async function main(){
    await mongoose.connect(`${config.DB_URL}/${config.DB_NAME}`)
    console.log('MongoDB Connected')
}
main().catch((error)=>console.error('MongoDB Connection Failed',error))

export default mongoose