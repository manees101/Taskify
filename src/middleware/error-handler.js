const {CustomeAPIError}=require("../errors/custom-error");
const errorHandler=(err,req,res,next)=>{
    if(err instanceof CustomeAPIError)
    {
        return res.status(err.statusCode).json({msg:err.message});
    }
   return res.status(err.status).json({msg:err.message});
}

module.exports=errorHandler;