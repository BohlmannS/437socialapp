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

router.post('/', function(req, res){
	let sql = 'select greater from friends where lower=' + req.body.uid + ' union select lower from friends where greater='+req.body.uid;
	connection.query(sql, function(err, rows, fields){
		if(err){
			res.end(JSON.stringify('no friends'));
			return;
		}
		//query returns an array with objects with one prop: greater and the id num of a friend
		let response = [];
		if(rows.length===0){
			//console.log('no friends');
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(rows));
			return;
		}
		//console.log(rows);
		//console.log(rows[rows.length-1].greater);
		var numClasses = 0;
		for (var prop1 in req.body.classList){
			numClasses++;
		}
		let fString = '';
		let sql2 = 'select username, class1, class2, class3, class4, class5, class6, class7, class8, class9, class10 ';
		sql2+='from users inner join schedules on users.uid=schedules.uid where (';
		let classIds = ' in (';
		for(var prop1 in req.body.classList){
			classIds+=req.body.classList[prop1];
			classIds+=",";
		}
		classIds = classIds.slice(0, -1);
		classIds+=') or ';
		for(var prop1 in req.body.classList){
			sql2+=prop1;
			sql2+=classIds;
		}
		sql2 = sql2.slice(0, -4);
		//console.log(sql2);
		sql2 += ') and (users.uid in (';
		for(var m = 0; m < rows.length; m++){
			sql2+=rows[m].greater + ',';
		}
		sql2 = sql2.slice(0, -1);
		sql2 += '))';	
		connection.query(sql2, function(err, rows2, fields){
			if(err){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify([]));
				return}
			let myName = 'select username from users where uid=';
			myName+=req.body.uid;
			connection.query(myName, function(err, rows3, fields){
				if(err){return}
				let me = rows3[0].username;
				for(var i = 0; i < rows2.length; i++){
					if(rows2[i].username === me){
						rows2.splice(i, 1);
					}
				}
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(rows2));
//				console.log(JSON.stringify(rows2));
			})
		})
		//res.setHeader('Content-Type', 'application/json');
		//res.end(JSON.stringify(rows));
		return;
		})
});

module.exports = router;
