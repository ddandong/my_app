var express = require('express');
var path = require('path');
var app = express();

app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname ,'public')));

app.get('/',function(){
  res.render('my_first_ejs');
});

app.listen(3000,function(){
  console.log('Sever is On!');
});
