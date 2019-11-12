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

connection.connect(function(err) {
  if(err){
    console.log(err.code);
    console.log(err.fatal);
    console.log('error: ' + err.message);
    return;
  }
});



router.post('/', function(req, res) {
    let sql = 'delete from schedules where uid='+req.body.uid;
    connection.query(sql, function(err, rows, fields){
        if(err){
res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify('Error deleting schedule. Might occur if you did not have on in the first place'));
                return;
        }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify('your schedule was deleted'));
    })

});

module.exports = router;

