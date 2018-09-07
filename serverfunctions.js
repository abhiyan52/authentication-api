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
 
    exports.login = (email,password) => {
    
        let db =connect();
        return validate(email,password,db);
       
}


  
  exports.insert = (name,email,password) => {
    let db = connect();
  var sql = `INSERT INTO user VALUES ("${name}","${email}","${password}")`;
return new Promise((resolve,reject)=>{
  db.run(sql,function(err){
      if(err)
      {
       if(err.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email")
      reject("USER ALREADY EXISTS");
       }
      else
      {
        resolve(`THE USER ${name} has been registered`);
      }
  });
});
}


exports.forget = (email,res) =>{
    let db = connect();
    let sql = `SELECT password p from user where email = ?`;
    return new Promise((resolve,reject)=>{
        db.get(sql,[email],function(err,row){
            if(err)
            reject("SERVER ERROR " + err.message);
            else
            row?resolve(`THE PASSWORD FOR ${email} is ${cryptr.decrypt(row.p)}`)
            : reject(`CANNOT FIND ${email}`)
        });
     db.close();
});
}

exports.reset = (email,pass,newpassword) => {

    let db = connect();
    let sql=`UPDATE user set password = ? where email=?`;


  return new Promise((resolve,reject)=>{
   let test = validate(email,pass,db);

   test.catch(()=>{
      reject('INVALID DETAILS PROVIDED');
   });


    db.run(sql,[cryptr.encrypt(newpassword),email],function(err){
        if(err)
        {
            reject("ERROR : "+err.message);
        }
        else
        { 
            if(this.changes === 0)
             reject(`NO ENTRIES FOUND for ${email}`);

           resolve(`${this.changes} ENTRY UPDATED IN DATABASE for ${email}`);
        }
    });
db.close();
  });
}

var validate = (email,password,db)=>{
    let sql = `SELECT password p from user where email = ?`;
    return new Promise((resolve,reject)=>{
        db.get(sql,[email],function(err,row){
           if(err)
            {
               reject("SERVER FAILED TO RESPONSE  " + err.stack);
             }
             if(row)
                 {
                    if(cryptr.decrypt(row.p) == password || row.p ==password)
                    {
                         resolve(`LOGIN SUCESSFUL`);
                    }
                    else
                    {
                         reject(`INVALID DETAILS OF PASSWORD`);
                    }
                 }
                else
                {
                      reject("USER DOESNOT EXISTS");
                }
     
}); 
        
});
};