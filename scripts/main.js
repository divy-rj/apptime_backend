
const mongoose=require('mongoose');
const express=require('express');


const {User,validateuser,hash}=require('../models/user');
var app=express();
app.use(express.json());
const uri = "mongodb+srv://apptime_admin:123456789.apptime@apptime.riki1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const joi=require('joi');
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
        const user=await User.find({email:email,password:password});
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
app.post('/user/authentication',(req,res)=>{
    hash(req.body.password).then(password=>{
        user_autentication(req.body.email,password).then(user=>{
            res.status(200).send(user);
            console.log(user+"user")
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
                res.status(200).send(user._id);
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
app.get('/year/:year',(req,res)=>{
    getmoviesbyyear(parseInt(req.params.year)).then(m=>{
        if(m.length>0){
            res.send(m);
            console.log('data sent sucessfully !');
        }
        else
        {
            res.status(404).send('not found');
            console.log('data not found');
        }
    });

});

app.post('/setmovie',(req,res)=>{
    const movie=new Movie({
        name:req.body.name,
        year:req.body.year,
        director:req.body.director
    });
    setmovies(movie).then(m1=>{
        res.send(m1);
        console.log('data saved sucessfully !');
    }).catch((err)=>{
        res.status(400).send(err.message);
        console.log(err.message);
    })
});
const port=3010;
app.listen(port,()=>{
    console.log(`listening at ${port}`);
})

