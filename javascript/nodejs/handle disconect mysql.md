# handle disconect mysql

```javascript
var db_config = {
  host: "localhost",
  user: "root",
  password: "Makuro_123",
  database: "malik_data"
}

var db;
function handleDisconnect(){
  db = mysql.createConnection(db_config)

  db.connect((err)=>{
    if(err){
      console.log("connect db error",err);
      setTimeout(handleDisconnect,1000);
    }
  });

  db.on('error',(err)=>{
    console.log("db error",err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();
    } else { 
      throw err;
    }
  })
}

handleDisconnect();

```
