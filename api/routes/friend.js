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
	let x = 'select uid from users where username=\'' + req.body.friendName + '\'';
	connection.query(x, function(error, roows, fiields){
	if(error || roows.length===0){return}
	let fid = roows[0].uid;
	let check = 'select * from friends where (lower='+fid+' and greater='+req.body.uid+') or (lower='+req.body.uid+' and greater='+fid+')';
	connection.query(check, function(err5, rows5, fields5){
	if(err5 || rows5.length===0){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({class_id:-1, title:'none',days:'0000000',time:'2:30p-3:50p',course_num:'CSE 437S',section:0}));
		return;
	}
        let sql = 'select class1,class2,class3,class4,class5,class6,class7,class8,class9,class10 from schedules where uid='+fid;
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
                if (rows.length===0){
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(rows));
                        return;
                }
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
                                myClasses.push(rows2[0]);
				response.push(rows2[0]);
                                //console.log(myClasses);
                                if(myClasses.length === c){
                                        //console.log('got all my classes');
                                        //console.log(response);
                                        //console.log(JSON.stringify(response));
 					response.forEach(function(element){
						element.days = dec2bin(element.days.readInt8());
						while (element.days.length < 7){
							element.days = '0' + element.days;
						}
					});                                       
                                        res.setHeader('Content-Type', 'application/json');
                                        res.end(JSON.stringify(response));
                                }
                        })
                }

        })})})
        //console.log('This is rows: ', rows);
        //res.setHeader('Content-Type', 'application/json');
        //res.end(JSON.stringify(rows));
});

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

module.exports = router;
