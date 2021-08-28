
const mongoose=require('mongoose');
const express=require('express');


const {User,validateuser,hash}=require('../models/user');
var app=express();
app.use(express.json());
const uri = "mongodb+srv://apptime_admin:123456789.apptime@apptime.riki1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const joi=require('joi');
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("connected to db");
    })
    .catch(()=>{
        console.log("not connected");
    });
async function Resisteruser(user){

    console.log("registering");
    try {
        const u=await user.save();
        console.log("loh + "+u);
        return u;
    }
    catch (err){
        console.log(err.message+"saving error");

    }
}

async function user_autentication(email,password){

    try {
        const user=await User.find({email:email,password:password});
        if(user)
        {  // console.log(user+"hii");
            return user;
        }
        else
        {
            return new Error().message("Authentication failed");
        }
    }
    catch (err){
        console.log(err.message+"error");

    }
}
async function  user_authentication_id(id){
    try{
        let user=User.find({_id:id});
        if(user){
            return user;
        }
        else
        {
            return new Error().message("Authentication failed");
        }
    }
    catch (err){
        console.log(err.message+"error");

    }
}
app.post('/user/authentication',(req,res)=>{
    hash(req.body.password).then(password=>{
        user_autentication(req.body.email,password).then(user=>{
            res.status(200).send(user);
            console.log(user+"useriii")
        }).catch(err=>{
            res.status(400).send(err.message+"400");
            console.log(err.message+"400")
        }).catch(err=>{
            res.status(200).send(err.message+"200");
            console.log(err.message+"200")
        })
    })
})
app.post('/user/authid',(req , res)=>{
    user_authentication_id(req.body.id).then(user=>{
        res.status(200).send(user);
        console.log(user+"useriii")
    }).catch(err=>{
        res.status(400).send(err.message+"400");
        console.log(err.message+"400")
    })
})

app.post('/user/register',(req,res)=>{
    const us={
        email:req.body.email,
        name:req.body.name,
        password:req.body.password
    };

    const vr=validateuser(us);
    if (!vr.error)
    {
        hash(req.body.password).then(has=>{
            const user=new User({
                email:req.body.email,
                name:req.body.name,

                password:has
            })
            Resisteruser(user).then(ussr=>{
                res.status(200).send("hello"+ussr._id);
                console.log("user saved hello");
            }).catch((err)=>{
                res.status(400).send(err.message);
                console.log('error aya');
            })
        }).catch(()=>{
            console.log('gannd marao');
        })
        // console.log(passcode);

    }
    else{
        res.status(400).send(vr.error );
    }
})


const port=3010;
app.listen(port,()=>{
    console.log(`listening at ${port}`);
})

