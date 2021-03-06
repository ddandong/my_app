var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open",function(){
    console.log("DB Connected!");
});
db.on("error",function(err){
    console.log("DB ERROR : " ,err);
});

//Model setting
var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});

var Post = mongoose.model('post',postSchema);

app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname ,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//Set routes
app.get('/posts',function(req,res){
  Post.find({}).sort('-createdAt').exec(function(err,posts) {
    if(err) return res.json({success:false, message:err});
    //res.json({success:true, data:posts});
    res.render("posts/index", {data:posts});
  });
});

app.get('/posts/new',function(req,res){
    res.render("posts/new");
});

app.post('/posts',function(req,res){
  Post.create(req.body.post,function(err,post){
    if(err) return res.json({success:false, message:err});
    //res.json({sucess:true, data:post});
    res.redirect("/posts");
  });
});

app.get('/posts/:id', function(req,res){
    Post.findById(req.params.id, function(err,post){
      if(err) return res.json({sucess:false,message:err});
      //res.json({success:true, data:post});
      res.render("posts/show",{data:post});
    });
});

app.get('/posts/:id/edit', function(req,res){
    Post.findById(req.params.id, function(err,post){
      if(err) return res.json({sucess:false,message:err});
      //res.json({success:true, data:post});
      res.render("posts/edit",{data:post});
    });
});

app.put('/posts/:id', function(req,res){
  console.log("update");
  req.body.post.updateAt = Date().now;
  Post.findByIdAndUpdate(req.params.id,req.body.post, function(err,post){
    if(err) return res.json({success:false, message:err});
    //res.json({success:true,message:post._id +" updated"});
    res.redirect('/posts/'+req.params.id);
  });
});

app.delete('/posts/:id', function(req,res){
    Post.findByIdAndRemove(req.params.id, function(err,post){
      if(err) return res.json({success:false, message:err});
      //res.json({success:true, message:post._id+" deleted"});
      res.redirect("/posts");
    });
});

app.listen(4000,function(){
  console.log('Sever is On!');
});
