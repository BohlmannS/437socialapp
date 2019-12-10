var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./config.js');

var connection = mysql.createConnection(config);

connection.connect(function(err) {
      if(err){
      console.log(err.code);
      console.log(err.fatal);
      console.log('error connection to db: ' + err.message);
      return;
      }
});

router.post('/', function(req, res) {
	let sql = 'select * from schedules where uid=' + req.body.uid + ' or uid=' + req.body.fid;
	//console.log(sql);
	connection.query(sql, function(err, rows, f){
		if(rows.length === 1 || rows.length === 0){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify('<div>No shared classes</div>'));
		return;
		}
		//console.log(rows);
		let response = "";
		let classes1 = [];
		for(var prop1 in rows[1]){
			classes1.push(rows[1][prop1]);
		}
		console.log(classes1);
		for(var i = 1; i < 11; i++){
			if(classes1.includes(rows[0]['class'+i+'_name']) && rows[0]['class'+i+'_name'] !== null){
				response+='<div style="cursor:pointer;" onclick="classPage(\''+rows[0]['class'+i+'_name']+'\')">'+rows[0]['class'+i+'_name']+'</div><br>';
			}
		}
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(response));
		return;
	})
});

module.exports = router;
