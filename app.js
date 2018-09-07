var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
var server = require('./serverfunctions');
var path = require('path');


app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({  extended: true
})); 

app.use(express.static('./public'));


app.listen(3000,function(err){
    if(err)
    console.error("ERROR");
    else
    console.log("CLICK HERE TO VISIT THE PAGE http://localhost:3000");
});


app.route('/create')
 .get((req,res )=> res.sendFile(path.join(__dirname,"public","client.html")))
.post(function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    console.log(req.body.password);
    const password = cryptr.encrypt(req.body.password);
    let response = server.insert(name,email,password);
    response.then((reply)=>{
        res.json({"response" : reply}).status(200);
    }).catch((reason)=>{
       res.json({"response" : reason}).status(404);
    });
   });
   
app.post('/login',function(req,res){
    const email= req.body.email;
    const password = req.body.password;
    let response = server.login(email,password);
    response.then((reason)=> res.json({"response" : reason}).status(200)).catch((reason)=> res.json({"response" : reason}).status(404));
});


app.route('/forget')
 .get((req,res)=>{
    res.send(`
    <h1> Forget FORM </h1>
    <form method="post" action='/forget'>
    <label for="email">EMAIL<input type="email" name="email" required/></label>
    <input type="submit" value="RESET"/>
     </form>
`);
}).post((req,res)=>{
    let response = server.forget(req.body.email);;
    response.then((reason)=> res.json({"response" : reason}).status(200))
    .catch((reason)=> res.json({"response" : reason}).status(404));
});


app.route('/reset')
 .get((req,res)=>{
    res.send(`
     <h1> RESET FORM </h1>
     <form method="post" action='/reset'>
     <label for="email" >EMAIL<input type="email" name="email" required/></label>
     <label for="password" >CURRENT PASSWORD:<input type="password" name ="password" required/> </label>
     <label for="newpassword" >NEW PASSWORD<input type="password" name ="newpassword" required/> </label>
     <input type="submit" value="RESET"/>
     </form>
   `);
})
.post((req,res)=>{
    const email= req.body.email;
    const password = req.body.password;
    const newpass =req.body.newpassword;
    let response = server.reset(email,password,newpass);
    response.then((reason)=> res.json({"response" : reason}).status(200))
    .catch((reason)=> res.json({"response" : reason}).status(404));
 });







