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
		if(err2){return}
		let finished = rows2;
		finished.forEach(function(element){
			element.days = dec2bin(element.days.readInt8());
			while (element.days.length < 7){
				element.days = '0'+element.days;
			}
		});
		//console.log(finished);
		let colors = ['background-color:#4080C0;', 'background-color:#8040C0;', 'background-color:#0040C0;', 'background-color:#208040;', 'background-color:#509010;', 'background-color:#804060;', 'background-color:#406030;'];
		finished.forEach(function(element){
			let time = element.time;
			let startTime = time.substring(0, time.indexOf('-')-1);
			let endTime = time.substring(time.indexOf('-')+1);
			let startTimeHalf = time.substring(time.indexOf('-')-1, time.indexOf('-'));
			let endTimeHalf = time.substring(time.length-1);
			endTime = endTime.slice(0,-1);
			let startHour = startTime.substring(0, startTime.indexOf(':'));
			let startMin = startTime.substring(startTime.indexOf(':') + 1);
			startHour = parseInt(startHour);
			startMin = parseInt(startMin);
			let endHour = endTime.substring(0, endTime.indexOf(':'));
			let endMin = endTime.substring(endTime.indexOf(':') +1);
			endHour = parseInt(endHour);
			endMin = parseInt(endMin);
			if(startTimeHalf === 'a'){
				startHour = startHour * 100;
			}
			else{
				startHour += 12;
				startHour = startHour * 100;
			}
			startHour += startMin;
			if(startHour >= 2300) startHour -= 1200;
			if(endTimeHalf === 'a'){
				endHour = endHour * 100;
			}
			else{
				endHour += 12;
				endHour = endHour * 100;
			}
			endHour += endMin;
			if(endHour >= 2300) endHour -= 1200;
			element.startTime = startHour;
			element.endTime = endHour;
			});
		let latestEnd = findLatestEnd(finished);
		let day = 0;
		let table = '<div class="row"><div id="grdSched" style="min-width:875px; display:block;">';
		table += '<table class="tbl" cellspacing="0" width="100%"><tbody><tr>';
		table += '<th class="tblHeaderCell" width="60px" style="border:1px solid gray; border-left:1px solid gray;"></th>';
		let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		for(var i = 0; i < 7; ++i){
			table+='<th class="tblHeaderCell" width="100px"';
			if(i === 6) table+='style="border-top:1px solid gray; border-right:1px solid gray;text-align:center">';
			else table += 'style="border-top:1px solid gray;text-align:center">';
			table+=days[i];
			table+='</th>';
			
		}
		table+='</tr>';
		let earlyTime = findEarlyTime(finished);
		let loopNum = calcLoopNum(earlyTime, latestEnd);
		let getColors = makeColors(finished);
		for(var i = 0; i < loopNum; i++){
			table+='<tr valign="top"><td class="tblTimeCell">';
			table+=militaryToNormal(earlyTime);
			table+='</td>';
			for(var j = 0; j < 7; j++){
				table+='<td class="tblCell" valign="top" ';
				if(typeof (getColors[j][earlyTime]) === 'undefined'){
					table+='style="border-top:1px solid gray; border-bottom:1px solid gray;"';
					table+='></td>';
				}
				else{
					table+='style="color:White;';
					table+= getColors[j][earlyTime];
					table+='">';
					table+=getName(finished, earlyTime, j);
					table+='</td>';
				}
			}
			table+='</tr>';
			earlyTime = add30Military(earlyTime);
		}
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(table));
	})
    	})

});

function getName(data, time, day){
	let res = '';
	data.forEach(function(e){
		if(e.days.charAt(day) === '1' && e.startTime === time){
			res = e.course_num + ' ' + e.section;
		}
	})
	return res;
}

function makeColors(data){
	let result = [{},{},{},{},{},{},{}];
let colors = ['background-color:#4080C0;', 'background-color:#8040C0;', 'background-color:#0040C0;', 'background-color:#208040;', 'background-color:#509010;', 'background-color:#804060;', 'background-color:#406030;'];	
	let c = -1;
	data.forEach(function(e){
		c++;
		for(var i = 0; i < 7; i++){
			if(e.days.charAt(i) === '1'){
				let s = e.startTime;
				let end = e.endTime;
				while(end > s){
					result[i][s] = colors[c];
					s = add30Military(s);
				}
			}
		}
	});
	return result;
}

function add30Military(t){
	if((t-30)%100 === 0) t+=70;
	else t+=30;
	return t;
}

function calcLoopNum(e, l){
	let c = 0;
	while(e < l){
		c++;
		e += 50;
	}
	return c;
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

function findLatestEnd(data){
	let result = data[0].endTime;
	data.forEach(function(element){
		if(element.endTime > result) result = element.endTime;
	})
	return result;
}

function findEarlyTime(data){
	let result = data[0].startTime;
	data.forEach(function(e){
		if(e.startTime < result) result = e.startTime;
	})
	return result;
}

function militaryToNormal(data){
	let flag = false;
	if(data > 1259){
		data -= 1200;
		flag = true;
	}
	let result = data.toString();
	result = result.slice(0, result.length-2) + ':'+result.slice(result.length-2);
	if(flag)result+=' AM';
	else result+=' PM'
	return result;
}

module.exports = router;
