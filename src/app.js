require("dotenv").config();
const express=require("express");
const app=express();
const path=require("path");
const hbs=require("hbs");
const cookieParser=require("cookie-parser");
require("./db/conn");
const resourcePath=path.join(__dirname,"../public");
const viewPath=path.join(__dirname,"./templates/views");
const partialPath=path.join(__dirname,"./templates/partials");
const port=process.env.PORT||7000;
const router=require("./router/router");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set("view engine","hbs");
app.set("views",viewPath);
app.use(express.static(resourcePath));
app.use(router);
hbs.registerPartials(partialPath);

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});