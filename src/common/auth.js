import bcrypt from 'bcryptjs'
import config from './config.js'

const hashData = async(str)=>{
    let salt = await bcrypt.genSalt(config.SALT)
    let hash = await bcrypt.hash(str,salt)
    return hash
}

const compareHash = async(hash,str)=>{
    return await bcrypt.compare(str,hash)
}

export default {
    hashData,
    compareHash
}