var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./config.js');

var connection = mysql.createConnection(config);

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

