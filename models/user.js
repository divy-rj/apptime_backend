const mongoose=require('mongoose');
const joi=require('joi');
const bcrypt=require('bcrypt');
// const appschema=mongoose.Schema({
//     appname:{
//         type:String,
//     },
//     usage_time:{
//         type:Number,
//     }
// })
//
// const appusagelistschema=mongoose.Schema({
//     usage_date:{
//         type:Date,
//     },
//     usages:{
//        type:[appschema],
//     }
//
// })

const userschema=mongoose.Schema({
    parentalacess:{
        type:Boolean,
    },
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
    },
    usage:{
        type:Array,
        default:[],
    },
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
const salt="$2b$10$hnuOCv0tfrWZiyagqe3SH.";
async function hash(value){
    console.log("hashing now");


    const hashed=await bcrypt.hash(value,salt);

    if(hashed)
        return hashed;
    else
        return new Error().message('Internal error');
}


exports.User=User;
exports.validateuser=validateuser;
exports.hash=hash;
