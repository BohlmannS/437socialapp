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

router.get('/', function(req, res) {
	var dir = __dirname;
	dir = dir.substring(0, dir.indexOf('/routes'));
	if(req.query.token === undefined){
		res.sendFile(dir + '/public/verifyfail.html');
		return;
	}
	let sql = 'select username from verification where token=\'' + req.query.token + '\'';
	connection.query(sql, function(err, rows, fields){
		if(err){
			console.log(err);
		}
		if(rows.length === 0){
			res.sendFile(dir + '/public/verifyfail.html');
			return;
		}
		let sql2 = 'update users set verified=1 where username=\'' + rows[0].username + '\'';
		connection.query(sql2, function(err2, rows2, fields2){
			if(err2) return;
			res.sendFile(dir + '/public/verifysuccess.html');
			return;
		})
	})	
});

module.exports = router;
