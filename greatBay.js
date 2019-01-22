
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Uarehereforme15!",
  database: "ice_creamDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
//   var sql='INSERT INTO book set ?;',{
//     title:"MyTitle",
//     artist:"ddd"
//   };
//   var sql='SELECT b.title,b.artist FROM book b;';
var q=connection.query('INSERT INTO book set ?;',{
    title:"MyTitle",
    artist:"ddd"
  }, function (error, results, fields) {
    if (error) throw error;
//    console.log(results);
   console.table(results);
    
    // console.log(fields);
  });
  console.log(q.sql);
//   connection.end();
});

