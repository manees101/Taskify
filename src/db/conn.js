const mongoose=require("mongoose");
require("colors")
async function connectDB(url)
{
    try
    {
       await mongoose.connect(url)
        console.log("Connected to DB successfully".blue.bold)
    }
    catch(err)
    {
        console.log(`${err}`.red.bold)
    }
    
        
}

module.exports=connectDB