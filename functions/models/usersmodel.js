const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const userSchema=new mongoose.Schema({
      name:{
        type:String,
        required:true
      },
      username:{
         type:String,
         required:true,
         unique:true
      },
      email:{
        type:String,
        reqired:true,
        validate(value)
        {
          if(!validator.isEmail(value))
          {
            throw new Error("Email formate is not correct");
          }
        }
      },
      password:{
        type:String,
        required:true,
        validate(value)
        {
          if(!validator.isStrongPassword(value))
          {
            throw new Error("Please choose a strong password");
          }
        }
      },
      notes:[{
          type:String
        }] ,   //array to stores notes of the user
        trash:[{type:String}]
        ,
      tokens:[{
        token:String
      }]
});



userSchema.methods.generateToken=async function(){
  try{
       const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
       this.tokens=this.tokens.concat({token:token});
       await this.save();
       return token;
  }catch(err)
  {
     throw err;
  }
}
userSchema.methods.loadNotes=()=>{
   localStorage.setItem("notes",JSON.stringify(this.notes));
   localStorage.setItem("delNotes",JSON.stringify(this.trash));
}
userSchema.methods.insertNotes=()=>{
  const data=localStorage.getItem("notes");
  const notesArr=JSON.parse(data);
  this.notes=notesArr;
}
userSchema.methods.insertTrash=()=>{
  const data=localStorage.getItem("delNotes");
  const notesArr=JSON.parse(data);
  this.trash=notesArr;
}
const Users=new mongoose.model("ToDoUser",userSchema);
module.exports=Users;