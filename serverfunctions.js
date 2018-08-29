var exports = module.exports;
const sqlite3 = require('sqlite3').verbose();
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');


 const connect = function() {
     let db = new sqlite3.Database('./db/user.db',function(err){
       if(err){
           console.error(err.message);
       }
       else
        console.log("CONNECTION SUCESSFUL");
     });

     return db;
}
 
     exports.login = (email,password,res) => {
         
    let db =connect();
    var result='';
     let sql = `SELECT password p from user where email = ?`;
     db.get(sql,[email],function(err,row){
      
        if(err)
        {
        console.log(err.message);
        
        }
        else
        {
            if(row)
             {
                if(cryptr.decrypt(row.p) == password || row.p ==password)
                {
                   
                    res.send(`LOGIN SUCESSFUL
                    <br/><a href="/">CLICK HERE TO RETURN TO MAIN PAGE </a>
                    `);
                }
                else
               {
                   res.send(`INVALID DETAILS OF PASSWORD
                   <br/><a href="/">CLICK HERE TO RETURN TO MAIN PAGE </a>
                   `);
               }
             }
            else
            {
            res.send(`USER DOESNOT EXISTS
            <br/><a href="/">CLICK HERE TO RETURN TO MAIN PAGE </a>
            `);
            }
        }
        db.close();
        console.log(result);
      
     });
  }


  
  exports.insert = (name,email,password,res) => {
       let db = connect();
       var sql = `INSERT INTO user VALUES ("${name}","${email}","${password}")`;
       db.run(sql,function(err){
        if(err)
        {
           console.log(err.message);
           db.close();
           return false;
        }
        else
        {
            let response = `THE USER ${name} has been registered
            <br/><a href="/">CLICK HERE TO RETURN TO MAIN PAGE </a>
            `;
            res.send(response);
        }
        db.close();
        return true;
       });
}

exports.forget = (email,res) =>{
console.log("IN FORGET");
    let db = connect();
    let sql = `SELECT password p from user where email = ?`;
    db.get(sql,[email],function(err,row){
        if(err)
        console.log("ERROR");
        else
        row?res.send(`THE PASSWORD FOR ${email} is ${cryptr.decrypt(row.p)}
        <br/><a href="/">CLICK HERE TO RETURN TO MAIN PAGE </a>
        `): res.send(`CANNOT FIND ${email}
        <br/><a href="/">CLICK HERE TO RETURN TO MAIN PAGE </a>
        `)
    });
}

exports.reset = (email,pass,res) => {
    console.log("IN RESET");

    let db = connect();
    let sql=`UPDATE user set password = ? where email=?`;
    db.run(sql,[cryptr.encrypt(pass),email],function(err){
        if(err)
        console.log(err);
        else
        {
           res.send(`${this.changes} ENTRY UPDATED
           <br/><a href="/">CLICK HERE TO RETURN TO MAIN PAGE </a>
           `);
        }

    })
}
