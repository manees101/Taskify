const jwt=require("jsonwebtoken");
const Users=require("../models/usersmodel");
const auth=async(req,res,next)=>{
try{
    const token=req.cookies.jwt;
    const verify=jwt.verify(token,process.env.SECRET_KEY);
    next();
   
}  catch(err)
{
   res.status(500).redirect("/login");
}   
}

module.exports=auth;