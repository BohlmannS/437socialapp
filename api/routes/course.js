var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');
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

router.post('/', function(req, res){
	let uid=req.body.uid;
	let course=req.body.course;
	let sql = 'select greater from friends where lower='+uid+' union select lower from friends where greater='+uid;
	connection.query(sql, function(err, rows, fields){
		if(err || rows.length===0){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(1));
			return;
		}
		let sql2 = 'select class_id, time, course_num, section from classes where title=\'' + course + '\'';
		connection.query(sql2, function(err2, rows2, fields2){
		if(err2){res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(1));
			return;}
		console.log(rows2);
		let id = rows2[0].class_id;
		let time = rows2[0].time;
		let num = rows2[0].course_num;
		let section = rows2[0].section;
		let sql3 = 'select username, first_name, last_name from users inner join schedules on users.uid=schedules.uid where users.uid in (';
		for(var i = 0; i < rows.length; i++){
			sql3+=rows[i].greater + ',';
		}
		sql3 = sql3.slice(0, -1);
		sql3+=') and 
	})})	
});

module.exports = router;

