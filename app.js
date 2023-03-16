const express = require("express");
const app = express();
const mongoose=require('mongoose');
app.set("view engine", "ejs");
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://sahillathib:skssl786@cluster0.ig2hfue.mongodb.net/todolistDB", {useNewUrlParser:true,useUnifiedTopology: true});
const itemschema=new mongoose.Schema({
  name:String,
});
const Item=new mongoose.model('Item',itemschema);
const cschema=new mongoose.Schema({
    item:itemschema
});
const Today=new mongoose.model("todayitem",cschema);


app.get("/", function (req, res) {
    var mylist=Today.find({}).exec().then(function(result){
        res.render("list", { listtitle: 'today',items:result,route:"/" })
});
});
app.get("/:parameter",function(req,res)
{   var title=req.params.parameter;
    heading=title;
    if(title==="about")
    {
        res.render("about");
    }
    else
    {
        route="/"+title;
        title=title+"item";
        
            const List=new mongoose.model(title,cschema);
        
            List.find({}).exec().then(function(result){
                res.render("list", { listtitle: heading,items:result,route:route });
            });
    }
});

app.post("/",function(req,res)
{
    var value=req.body.newitem;
    var item=new Item({
        name:value
    });
    var list=Today({
        item:item
    });
    list.save();
    res.redirect('/');
});

app.post("/:parameter",function(req,res)
{
    const route="/"+req.params.parameter;
    const modelname=req.params.parameter+"item";
    const mymodel=new mongoose.model(modelname,cschema);
    var value=req.body.newitem;
    var item=new Item({
        name:value
    });
    var list=new mymodel({
        item:item
    });
    list.save();
    res.redirect(route);
});

app.post("/:parameter/delete",function(req,res)
{
    modelname=req.params.parameter+"item";
    const List=new mongoose.model(modelname,cschema);
    List.findByIdAndRemove(req.body.checkbox).exec();
    if (req.params.parameter === "today")
    res.redirect('/');
    else
    res.redirect("/"+req.params.parameter);
});

app.listen(3000, function () {
    console.log("server is on and running on port 3000");
});