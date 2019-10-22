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
	//console.log(req.body); uid : 1, classList: {...}
	//console.log(req.body.uid); 1
	//console.log(req.body.classList); {class1: '..', class2: '..'}
	let sql = 'select greater from friends where lower=' + req.body.uid + ' union select lower from friends where greater='+req.body.uid;
	
	connection.query(sql, function(err, rows, fields){
		if(err){
			res.end(JSON.stringify('no friends'));
			return;
		}
		//query returns an array with objects with one prop: greater and the id num of a friend
		let response = [];
		if(rows.length===0){
			console.log('no friends');
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(rows));
			return;
		}
		console.log(rows);
		var numClasses = 0;
		for (var prop1 in req.body.classList){
			numClasses++;
		}
		
		connection.query(('select class1,class2,class3,class4,class5,class6,class7,class8,class9,class10 from schedules where uid=' + req.body.uid), function(err2, rows2, fields2){
		if(err) return;
		if(rows2.length===0){
			res.setHeader('Content-Type', 'application/json');
               	 	res.end(JSON.stringify(rows2));
                	return;
			}
		//count from schedules where uid = a friend id and any class field = class id
			let fString = '';
			for(var k = 0; k < rows.length; k++){
				for(var prop1 in rows[k]){fString += 'uid='+rows[k][prop1] + ' or ';}
			}
			fString = fString.slice(0, -3);
			for(var j = 1; j <= numClasses; j++){
				let s = 'select count(*) from schedules where (' + fString + ') and class' + j + '=' + rows2['class'+j];
				connection.query(s, function(err3, rows3, fields3){
					if(err3) {console.log(err3.fatal); return;}
					console.log('logging rows 3');
					console.log(rows3);
				})
			}
		})
		for(var i = 0; i < numClasses; i++){
			
		}
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(rows));
		return;
		})
});

module.exports = router;
