const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const date = require(__dirname+'/myscript.js');
const mongoose = require('mongoose');


app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://sid_24:sekhs2000@sid-sekhar-24-v860y.mongodb.net/todoListDB",{useNewUrlParser:true,useUnifiedTopology:true});

const itemsSchema = new mongoose.Schema({
  name:String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name : "Welcome to ToDo List."

});

const item2 = new Item({
  name : "Hit the + to add item."
});

const item3 = new Item({
  name : "<- Hit this to delete an item."
});

const defaultItems = [item1,item2,item3];

const listSchema = new mongoose.Schema({
  name : String,
  items : [itemsSchema]
});

const List = mongoose.model("List",listSchema);





var formData = [];
let workList=[];

app.get("/",function(req,res)
{
  // var day=date.getDate()
  Item.find({},function(err,items){
    if(items.length === 0)
    {
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
    }
        else
    {
          console.log("Successfully created and updated the collections.");
    }
      });
      res.redirect("/");
    } else {
        res.render('list',{day:"Today",item:items});
    }

  });

});




app.post("/",function(req,res){
  const obj=req.body.t;
  const liseru = req.body.button;

  const itemss = new Item({
    name : obj
  });

  if(liseru === "Today"){
    itemss.save();
    res.redirect("/")
  }
  else {
    List.findOne({name:liseru},function(err,found){
      found.items.push(obj);
      found.save();
      res.redirect("/" + liseru);

    });
  }



});


app.post("/delete",function(req,res){
  const id = req.body.checkbox;
  const delName = req.body.listName;
  if(delName === "Today"){

    Item.findByIdAndDelete(id,function(err){
      if(!err){
        console.log("Successfully deleted");
        res.redirect("/");
      }
    });
  }else {
    List.findOneAndUpdate({name:delName},{$pull:{items:{_id:id}}},function(err,results){
      if(!err){
        res.redirect("/"+delName);
      }else {

      }
    });
  }



});

app.get("/:work",function(req,res){
  let workName = req.params.work;
  // console.log(workName);

  List.findOne({name:workName},function(err,foundItems){
    if(!err){
      if(!foundItems){
        const list = new List({
          name : workName,
          items:defaultItems
        });
        // console.log(defaultItems);
        list.save();
        res.redirect("/"+workName);
      }else {
        // console.log(foundItems.items);
         res.render("list",{day:foundItems.name,item:foundItems.items});
      }
    }
  });

});

app.post("/work",function(req,res){
  workList.push(req.body.t);
  res.redirect("/work");
});


app.listen(8080,function(){
    console.log("Listening in port");
});
