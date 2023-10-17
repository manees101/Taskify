const errorHandler=(err,req,res,next)=>{
    res.status(500).send("Something went wrong. Try again later");
}

module.exports=errorHandler;