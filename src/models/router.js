const express = require("express");
const router = new express.Router();
const ToDoUsers = require('./usersmodel');
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const Users = require("./usersmodel");
const jwt = require("jsonwebtoken");
//handling get requests
router.get("/login", auth, (req, res) => {
    res.render("home");

});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/home", auth, (req, res) => {
    res.render("home");
});
router.get("/trash", auth, (req, res) => {
    res.render("trash");
})
router.get("/logout", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        const user = await Users.find({ _id: verify._id });


        user[0].tokens = user[0].tokens.filter((currToken) => {
            return currToken.token != token;
        })
        await user[0].save();
        res.clearCookie("jwt");

        res.render("login");

    }
    catch (err) {
        console.log(err);
    }
});
router.get("/profile",auth,(req,res)=>{
    res.render("profile");
})
//handling requests at user API
router.get("/users",async(req,res)=>{
    try{
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        const user=await Users.find({_id:verify._id});
        const data={
            username:user[0].username,
            name:user[0].name,
            email:user[0].email
        }
        res.send(data);
    }
   catch(err)
   {
      res.status(500).send(err);
   }
})
router.patch("/users",async(req,res)=>{
    try
    {
        const {name,username,email}=req.body;

        const result=await Users.findOneAndUpdate({username:username},{
            $set:{
                name:name,
                username:username,
                email:email
            }
        },{new:true});
        res.status(201).send("user updated successfully");
    }
    catch(err)
    {
        res.status(500).send(err);
    }

})
// handling post requests
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password, confirmPassword } = req.body;

        if (password == confirmPassword) {
            const encPass = await bcrypt.hash(password, 10);
            const user = new ToDoUsers({
                name: name,
                username: username,
                email: email,
                password: encPass,
            });
            const token = await user.generateToken();
            const result = await user.save();
            res.cookie("jwt", token, {
                httpOnly: true
            })
            res.render("home");
        }

    } catch (err) {
        console.log(err);
        res.render("register");
    }
});

router.post("/login", async (req, res) => {
    try {

        const user = await ToDoUsers.find({ username: req.body.username });
        const check = await bcrypt.compare(req.body.password, user[0].password);
        const token = await user[0].generateToken();
        res.cookie("jwt", token, {
            httpOnly: true
        });

        res.render("home");


    } catch (err) {
        res.render("login");
        console.log(err);
    }
});

//handeling Api requests for notes

router.get("/notes", async (req, res) => {
    try {

        const { username, password } = req.query;

        const data = await ToDoUsers.find({ username: username });

        const check = await bcrypt.compare(password, data[0].password);
        const noteObj = { notes: data[0].notes, trash: data[0].trash };
        res.send(noteObj);
    }
    catch (err) {
        res.status(404).send(err);
    }

})

router.patch("/notes", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        //  const username=req.body.username;
        const notesArr = req.body.notesArr;
        const trashNotes = req.body.trashNotes;
        const data = await ToDoUsers.findOneAndUpdate({ _id: verify._id }, {
            $set: {
                notes: notesArr,
                trash: trashNotes
            }
        }, { new: true });
        res.status(201).send(data);
    } catch (err) {
        res.send(err);
    }
})
module.exports = router;