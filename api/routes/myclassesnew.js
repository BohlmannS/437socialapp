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

router.post('/', function(req, res) {
	let sql='select class1, class2, class3, class4, class5, class6, class7, class8, class9, class10 from schedules where uid='+req.body.uid;
	let response = {};
        connection.query(sql, function(err, rows, fields){
		if(rows.length===0){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(1));
			return;
		}
                let classList = [];
		for(var i=1; i < 11; i++){
			if(rows[0]['class'+i]===null){
			}
			else{
				classList.push(rows[0]['class'+i]);
			}
		}
                let sql2 = 'select * from classes where class_id in (';
		classList.forEach(function(e){
			sql2+=e;
			sql2+=',';
		})
		sql2 = sql2.slice(0, -1);
		sql2+=')';
		connection.query(sql2, function(err2, rows2, fields2){
		let titles = [];
		let myData = '<a id="switch-view" style="color:#CC1219;cursor:pointer;">Switch To Grid View</a>';
		rows2.forEach(function(e){
			titles.push(e.title);
			myData += '<p style="color:black;cursor:pointer;" onclick="classPage(\''+e.title+'\')">';
			myData += e.course_num + ' ';
			myData += e.section + ' ';
			myData += e.title + ' ';
			let time = dec2bin(e.days.readInt8());
			while(time.length < 7){
				time = '0' + time;
			}
			myData += bin2days(time) + ' ';
			myData += e.time;
			myData += '</p><br>';

		})
		response.myData = myData;
		//my own classes are all loaded up ready to go
		let sql3 = 'select greater from friends where lower='+req.body.uid + ' union select lower from friends where greater='+req.body.uid;
		connection.query(sql3, function(err3, rows3, f3){
		if(err3 || rows3.length===0){
			resonse.mutualData = 2;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(response));
			return;
		}
		let ids = [];
		rows3.forEach(function(e){
			for(var prop1 in e){
				ids.push(e[prop1]);
			}
		})
		sql4 = 'select username, first_name, last_name, class1_name, class2_name, class3_name, class4_name, class5_name, class6_name, class7_name, class8_name, class9_name, class10_name from users inner join schedules on users.uid=schedules.uid where (';
		for(let j = 0; j < 10; j++){
			sql4+='class'+(j+1);
			sql4+='_name in (';
			titles.forEach(function(e){
				sql4+='\''+e+'\',';
			})
			sql4 = sql4.slice(0,-1);
			sql4+=') or ';
		}
		sql4 = sql4.slice(0, -4);
		sql4+=') and (users.uid in (';
		ids.forEach(function(e){
			sql4+=e;
			sql4+=',';
		})
		sql4 = sql4.slice(0,-1);
		sql4+='))';
		//console.log(sql4);
		connection.query(sql4, function(err4, rows4, f4){
			if(err4){console.log(err4);return}
			
		let c = {};
		titles.forEach(function(e){
		c[e]=[];
		c[e+' count'] = 0;
		for(var k = 0; k < rows4.length; k++){
			if(inClass(e, rows4[k])){
				c[e].push({username:rows4[k].username,first_name:rows4[k].first_name,last_name:rows4[k].last_name});
				c[e+' count'] = c[e+' count'] + 1;
			}
		}
		})
		let mutualData = '<p style="color:black;">';
		titles.forEach(function(e){
			mutualData += '<div style="cursor:pointer;" onclick="classPage(\''+e+'\')"><div style="cursor:pointer;" onclick="classPage(\''+e+'\')">';
			mutualData += e + ' - </div>';
			mutualData += c[e+' count'];
			mutualData += ' friends: ';
			for(var l = 0; l < c[e].length; l++){
				mutualData += c[e][l].first_name + ' ' + c[e][l].last_name + ', ';
			}
			mutualData = mutualData.slice(0, -2);
			mutualData += '</div><br>';
		})
		mutualData += '</p>';
		response.mutualData = mutualData;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(response));
		return;
		//end sql4
		})
		//end sql3
		})	
		})
        })

});

function inClass(className, obj){
	for(var prop1 in obj){
		if(obj[prop1]===className) return true;
	}
	return false;
}

function bin2days(bin){
	let d = ['M','T','W','R','F','S','U'];
	let r = '';
	for(let i = 0; i < bin.length; i++){
		if(bin.charAt(i) === '0') r+='-';
		else r+=d[i];
	}
	return r;
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}


module.exports = router;
