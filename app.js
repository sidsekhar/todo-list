const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const date = require(__dirname+'/myscript.js');

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

var formData = [];
let workList=[];
app.get("/",function(req,res)
{
  var day=date.getDate()
  res.render('list',{day:day,item:formData});
});

app.post("/",function(req,res){
  formData.push(req.body.t);
  res.redirect("/")
});

app.get("/work",function(req,res){
  var day = date.getDay();
  res.render("list",{day:day,item:workList});
});

app.post("/work",function(req,res){
  workList.push(req.body.t);
  res.redirect("/work");
});


app.listen(8080,function(){
    console.log("Listening in port");
});
