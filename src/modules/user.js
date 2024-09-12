import mongoose from './index.js';
import validators from '../common/validators.js';

const userSchema = new mongoose.Schema ({
    userName : {
        type :String,
        required:[true,"UserName is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        validate: {
            validator: validators.validateEmail,
            message: props => `${props.value} is not a valid email`
        }
    },
    password:{
        type:String,
        requried:[true,"password is required"]
    },
    randomString:{
        type:String
    }
},
{
    collection:'users',
    versionKey:false
})

export default mongoose.model('users',userSchema)