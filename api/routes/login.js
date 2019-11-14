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
      console.log('error connection to db: ' + err.message);
      return;
      }
});

router.post('/', function(req, res) {
    let sql = 'Select uid from users where username=\'' + req.body.username + '\' and password=\'' +req.body.password+'\'';
    //console.log(sql);
    connection.query(sql, function(err, rows, fields){
    	if(err){
		console.log("Error occured in query");
		//res.end(JSON.stringify('could not login')); 
		return;
	}
    //console.log("Query success");
    //console.log('This is rows: ', rows);
    //res.setHeader('Location', '/home_index');
    //res.end();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
    })
    
});

module.exports = router;
