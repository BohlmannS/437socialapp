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
        let uid = req.body.uid;
	let sql = 'select class1, class2, class3, class4, class5, class6, class7, class8, class9, class10 from schedules where uid=' + uid;
	connection.query(sql, function(err, rows, fields){
		if(err){
			//console.log("Error occured in query");
			res.setHeader('Content-Type', 'application/json');
                	res.end(JSON.stringify({data:'no schedule'}));
                	return;
       	 	}
	let classList = [];
	for (var prop1 in rows[0]){
		if(rows[0][prop1] !== null) classList.push(rows[0][prop1]);
	}
	let sql2 = 'select * from classes where class_id in (';
	classList.forEach(element => sql2+=element+',');
	sql2 = sql2.slice(0, -1);
	sql2+=')';
	connection.query(sql2, function(err2, rows2, fields2){
		if(err2){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify([{class_id:-1,title:'none',days:'0000000',time:'4:00p-5:20p',course_num:'CSE None',section:1}]));
		return}
		let finished = rows2;
		finished.forEach(function(element){
			element.days = dec2bin(element.days.readInt8());
			while (element.days.length < 7){
				element.days = '0'+element.days;
			}
		});
		console.log(finished);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(finished));
	})
    	})

});

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

module.exports = router;

