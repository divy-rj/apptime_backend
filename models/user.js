const mongoose=require('mongoose');
const joi=require('joi');
const bcrypt=require('bcrypt');
const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password:{
        type:String,
        required:true,
        minLength: 6,
        maxLength: 300
    }
});
const User=mongoose.model('User',userschema);
function validateuser(user){
    console.log("validating");
    const schema=joi.object({
        email:joi.string().required(),
        name:joi.string().required().max(50),
        password:joi.string().required()

    })
    //  console.log(c);
    return schema.validate(user);
}
let salt;
async function hash(value){
    console.log("hashing now");
    if(!salt)
        salt=await bcrypt.genSalt(10);
    const hashed=await bcrypt.hash(value,salt);
    console.log(hashed);
    if(hashed)
        return hashed;
    else
        return new Error().message('Internal error');
}


exports.User=User;
exports.validateuser=validateuser;
exports.hash=hash;
