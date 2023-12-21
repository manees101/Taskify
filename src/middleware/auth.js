const jwt=require("jsonwebtoken");
const Users=require("../models/usersmodel");
const auth=async(req,res,next)=>{
    try
    {
       const token=req.cookies.jwt
       if(token)
       {
          const verifyToken=jwt.verify(token,process.env.SECRET_KEY) 
          const user=await Users.findOne({_id:verifyToken._id})
          if(user)
          {
            const isValid=user.tokens.some((tokenObj) => {
                    return tokenObj.token == token;
                }); 
            if(!isValid)
            {
                
              res.redirect("/login")

            }
            else
            {
              next()
            }
          }
         else
         {
            res.redirect("/login")
         }
       }
       else
       {
        res.redirect("/login")
       }
    }
    catch(err)
    {
        res.redirect('/login')
       throw err
    }
}

module.exports=auth;