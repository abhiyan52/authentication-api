var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require("body-parser");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
var server = require('./serverfunctions');



app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({  extended: true
})); 

app.use(express.static('./assets/'));

app.listen(3000);

app.post("/create",function(req,res){
     const name = req.body.name;
     const email = req.body.email;
     const password = cryptr.encrypt(req.body.password);
     server.insert(name,email,password,res);
    });

app.post('/login',function(req,res){
     const email= req.body.email;
     const password = req.body.password;
     if(req.body.login)
     {
       
        let response = server.login(email,password,res);
    }
   else if(req.body.forget)
     {
    server.forget(email,res);
     }
     else
     {
         res.redirect(`/reset`)
     }
});

app.get('/reset',function(req,res){
    
    res.send(`
      
      <h1> RESET FORM </h1>
      <form method="post" action='/resetpass'>
      <label for="email">EMAIL<input type="email" name="email"/></label>
      <label for="password">NEW PASSWORD<input type="password" name ="password"/> </label>
      <input type="submit" value="RESET"/>
      </form>
    `);
});

app.post('/resetpass',function(req,res){
    const email= req.body.email;
    const password = req.body.password;
    server.reset(email,password,res);
});


