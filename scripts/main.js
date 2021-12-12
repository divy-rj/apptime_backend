
const mongoose=require('mongoose');
const express=require('express');


const {User,validateuser,hash}=require('../models/user');
var app=express();
app.use(express.json());
const uri = "mongodb+srv://apptime_admin:123456789.apptime@apptime.riki1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const joi=require('joi');
const auth=require('../auth/auth');
const jwt=require('jsonwebtoken');
const {ObjectId} = require("mongodb");
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
        const user=await User.findOne({email:email,password:password});
        if(user)
        {   console.log("Useeer" + user);
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
// app.post('/insert',auth,(req,res)=>{
// p
// })
app.post('/user/authentication',(req,res)=>{
    hash(req.body.password).then(password=>{
        user_autentication(req.body.email,password).then(ussr=>{
            const token=   jwt.sign({_id:ussr._id,parentalacess:ussr.parentalacess,email:ussr.email},'Apptime');//temporary use...will be env
            res.status(200).send(token);
            console.log("user saved hello");
        }).catch(err=>{
            res.status(400).send(err.message+"400");
            console.log(err.message+"400")
        }).catch(err=>{
            res.status(400).send(err.message+"400");
            console.log(err.message+"400")
        })
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
                const token=   jwt.sign({_id:ussr._id,parentalacess:ussr.parentalacess,email:ussr.email},'Apptime');//temporary use...will be env
                res.status(200).send(token);
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
app.patch('/user/update',(req,res)=>{
    hash(req.body.password).then(password=>{
        User.findOneAndUpdate({'email':req.body.old_email},{
       'email':req.body.email,
       'password':password,
       'name':req.body.name
    }).then(user=>{
        res.status(200).send(user)
        }).catch(err=>{
            res.status(400).send(err.message+"400");
            console.log(err.message+"400")
        })
    }).catch(err=>{
        res.status(400).send(err.message+"400");
        console.log(err.message+"400")
    })
})
app.delete('/user/delete',(req,res)=>{
    User.findOneAndRemove({'email':req.body.email}).then(()=>{
        res.status(200).send("Deleted")
        console.log("Deleted")
    }
    )

})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});