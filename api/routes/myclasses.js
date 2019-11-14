var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var util = require('util');

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
	let sql = 'select class1,class2,class3,class4,class5,class6,class7,class8,class9,class10 from schedules where uid=' + req.body.uid;
	//console.log(sql);
	let dataPacketSchedule = {};
	let myClasses = [];
	let response = [];
	let x = connection.query(sql, function(err, rows, fields){
		if (err){
			res.end(JSON.stringify('no class schedule'));
			return;
		}
		dataPacketSchedule = rows[0];
		if (rows.length==0){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(rows));
			return;
		}
                response.push(rows);
		var c = 0;
		for (var prop1 in dataPacketSchedule){
			//count how many props there are, then do a while loop and get the class data from the database and append it to the html. While loop will be used to trap code there until it has found all the info it needs.
		 if(dataPacketSchedule[prop1] !== null) {c++};   		
		}
		//console.log(c);
		var flag = true;
		for(var i = 1; i <= c; i++){
			connection.query(('select * from classes where class_id=' + dataPacketSchedule['class'+i]), function(err2, rows2, fields2){
				if(err2) {console.log(err2.fatal); return;}
				//console.log(rows2);
				myClasses.push(rows2[0]['title']);
				//console.log(myClasses);
				if(myClasses.length === c){
					//console.log('got all my classes');
					let obj1 = {};
					for(var j = 0; j < c; j++){
						obj1['class' + (j+1)] = myClasses[j];
					}
					response.push(obj1);
					//console.log(response);
					//console.log(JSON.stringify(response));
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(response));	
				}
			})
		}
		
	})
	//console.log('This is rows: ', rows);
	//res.setHeader('Content-Type', 'application/json');
        //res.end(JSON.stringify(rows));	
});

module.exports = router;
