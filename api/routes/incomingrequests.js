var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./config.js');

var connection = mysql.createConnection(config);


connection.connect(function(err) {
  if(err){
    console.log(err.code);
    console.log(err.fatal);
    console.log('error: ' + err.message);
    return;
  }
});

router.post('/', function(req, res) {
    let sql = 'Select req_from from requests where status=0 and req_to=\'' + req.body.uid + '\'';
    connection.query(sql, function(err, rows, fields){
        if(err || rows.length===0){
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify([{username:'',first_name:'',last_name:''}]));
                return;
        }
	let sql2 = 'select username,first_name,last_name from users where uid in (';
	rows.forEach(function(e){
		sql2+=e.req_from;
		sql2+=','
	})
	sql2=sql2.slice(0,-1);
	sql2+=')';
	connection.query(sql2, function(err2, rows2, fields2){
		if(err2){return}
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(rows2));
	})
	})
});

module.exports = router;
