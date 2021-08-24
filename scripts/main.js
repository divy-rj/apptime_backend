
const mongoose=require('mongoose');

const uri = "mongodb+srv://apptime_admin:123456789.apptime@apptime.riki1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true})
    .then(()=>{
        console.log("connected to db");
    })
    .catch(()=>{
        console.log("not connected");
    });