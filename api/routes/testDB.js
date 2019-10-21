var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'database-1.csbhhsidcs3g.us-east-2.rds.amazonaws.com',
  port : 3306,
  user : 'admin',
  password : 'bohlmannsbohlmanns',
  database : 'main_site'
});
var r = 0;

connection.connect(function(err) {
  if(err){
    console.log(err.code);
    console.log(err.fatal);
    console.log('error: ' + err.message);
    return;
  }
  console.log('connection created');
});

$query = `SELECT * FROM users`;

connection.query($query, function(err, rows, fields){
  if(err){console.log("Error occured in query"); return;}
  console.log("Query success");
  r = rows;
});

connection.end(function(){});

console.log(r);

router.get('/', function(req, res, next) {
    res.send(r);
});

module.exports = router;
