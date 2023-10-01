const mongoose=require("mongoose");

mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Connected to DB successfully");
}).catch((err)=>{
    console.log(err);
})