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
	let response = {};
	let sql = 'select greater from friends where lower='+uid+' union select lower from friends where greater='+uid;
	connection.query(sql, function(err, rows, fields){
		if(err || rows.length===0){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(1));
			return;
		}
		let sql2 = 'select class1, class2, class3, class4, class5, class6, class7, class8, class9, class10 from schedules where uid='+uid;
		connection.query(sql2, function(err2, rows2, f2){
			if(err2 || rows2.length===0) {return;}
			let sql3 = 'select * from classes where title=\''+course+'\' and class_id in (';
			for(var prop1 in rows2[0]){
				sql3+=rows2[0][prop1] +',';
			}
			sql3 = sql3.slice(0,-1);
			sql3+=')';
			connection.query(sql3, function(err3, rows3, f3){
				if(err3 || rows3.length===0) return;
				response.headInfo='<h1>Class: '+rows3[0].title + '</h1><h2>Section '+rows3[0].section+' '+rows3[0].time+'</h2>';
			let sql4 = 'select username, first_name, last_name, class1_name, class2_name, class3_name, class4_name, class5_name, class6_name, class7_name, class8_name, class9_name, class10_name, class1_section, class2_section, class3_section, class4_section, class5_section, class6_section, class7_section, class8_section, class9_section, class10_section from users inner join schedules on schedules.uid=users.uid where users.uid in (';
			rows.forEach(function(e){
				sql4+=e.greater + ',';
			})
			sql4 = sql4.slice(0,-1);
			sql4+=') and (';
			for(var i = 1; i < 11; i++){
				sql4+='class'+i+'_name=\''+course+'\' or ';
			}
			sql4 = sql4.slice(0,-4);
			sql4+=')';
			connection.query(sql4, function(err4, rows4, f4){
				if(err4){console.log(err4);return;}
				//console.log(rows4);
			
			response.yourSection = '';
			response.otherSection = '';
			rows4.forEach(function(e){
				if(sectionOrNot(rows3[0].section, course, e)){
					response.yourSection = response.yourSection + '<p onclick="friendPage(\''+e.username+'\')">';
					response.yourSection+=e.first_name + ' ' + e.last_name + '</p><br>';
				}
				else{
					 response.otherSection = response.otherSection + '<p onclick="friendPage(\''+e.username+'\')">';
					response.otherSection+= e.first_name + ' ' + e.last_name + ' - Section ' + whichSection(course, e) + '</p><br>';
				}
			})
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(response));
			return;
			})
			})
		})
	})	
});

function whichSection(title, obj){
	for(var i = 1; i < 11; i++){
		if(obj['class'+i+'_name']===title){
			return obj['class'+i+'_section'];
		}
	}
	return 0;
}

function sectionOrNot(section, title, obj){
	for(var i = 1; i < 11; i++){
		if(obj['class'+i+'_name']===title){
			if(obj['class'+i+'_section']===section){
				return true;
			}
			return false;
		}
	}
	return false;
}

module.exports = router;
