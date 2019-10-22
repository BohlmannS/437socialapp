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
    let sql = 'insert into users (username, password, verified) values (\'' + req.body.username + '\',\'' + req.body.password + '\',1)';
    console.log(sql);
    connection.query(sql, function(err, rows, fields){
        if(err){
                console.log("Error occured in query");
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify('That user already exists')); return;
        }
	else{
    console.log("Query success");
    console.log('This is rows: ', rows);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify('Account Created! Click login to continue!'));
	}
    })

});

module.exports = router;

