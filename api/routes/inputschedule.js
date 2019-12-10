var express = require('express');
var router = express.Router();
var mysql = require('mysql');
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
	let left = req.body.schedule;
	const x = writeSchedule(left);
	let copy = req.body.schedule;
	let contains = req.body.scheule.includes(req.body.name);
	if(x == null !(contains)){
		res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify('Could not read any classes here. Ensure you are inputting schedule properly'));
		return;
	}
	/*for(var i = 0; i < x.length; i++){
		console.log(x[i]);
	}*/
	let q = connection.query('select class_id, title, section from classes', function(err, rows, fields){
	//console.log(rows);
	if(err){return}
	var dict = new Object();
	for(var j = 0; j < rows.length; j++){
		dict[[rows[j].title+rows[j].section]] = 1;
	}
	//console.log(dict);
	var titles = [];
	var sections = [];
	//console.log('Introduction to Systems Software' in dict);
	let sql = 'insert into classes (title, days, time, course_num, section) values ';
	for(var i = 0; i < x.length; i++){
		//course num first. str will continuously eat up values and make string smaller
		let str = x[i].substring(10);
		str = str.substring(str.indexOf(' ')+1);
		let course_num = str.substring(0, nthIndex(str, ' ', 2));
		//console.log(course_num);
		str = str.substring(nthIndex(str, ' ', 2)+1);
		let section = parseInt(str.substring(0, 2));
		sections.push(section);
		//console.log(section);
		str = str.substring(3);
		let title = str.substring(0, str.indexOf('\t'));
		titles.push(title);
		//console.log(title);
		str = str.substring(str.indexOf('\t'));
		str = str.substring(nthIndex(str, '\t', 3));
		str = str.substring(1);
		let daysString = str.substring(0,7);
		let days = '';
		days = daysString.replace(/[a-zA-Z]/g,'1');
		days = days.replace(/-/g,'0');
		//console.log(days);
		let time = str.substring(str.indexOf(' ')+1);
		let insert = '(\''+title+'\','+'0b'+days+',\''+time+'\',\''+course_num+'\','+section+'),';
		if(!((title+section) in dict))
			sql+=insert;
	}
	sql = sql.slice(0, -1);
	//console.log(sql);
	if(titles.length !== 0){
	let sql2 = 'select class_id, title, section from classes where ';
	for(var k = 0; k < titles.length; k++){
		sql2+='(title=\'' + titles[k] + '\' and section='+sections[k]+') or ';
	}
	sql2 = sql2.slice(0, -4);
	//console.log(sql2);
	if(sql === 'insert into classes (title, days, time, course_num, section) values'){
		//all classes are in table, no insertion needed.
		connection.query(sql2, function(err2, rows2, fields2){
			if(err2){console.log(err2)
				return}
			//console.log(rows2);
			let sql3 = 'insert into schedules (uid,';
			let vals = [];
			for(var l = 0; l < rows2.length; l++){
				sql3+='class'+(l+1)+','+'class'+(l+1)+'_name ,class'+(l+1)+'_section ,';
				vals.push(rows2[l]['class_id']+','+'\''+rows2[l]['title']+'\','+rows2[l]['section']);
			}
			sql3 = sql3.slice(0, -1);
			sql3+=') values (';
			sql3+=req.body.uid+',';
			for(var l = 0; l < vals.length; l++){
				sql3+=vals[l]+',';
			}
			sql3 = sql3.slice(0, -1);
			sql3+=')';
			connection.query(sql3, function(err3, rows3, fields3){
				if(err3){
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify('you already have a schedule'));
				return}
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify('schedule inserted'));
				return;
			})
		})
	}else{
		//classes must be inserted into table
		connection.query(sql, function(err4, rows4, fields4){
			if(err4){console.log(err4);return}
			connection.query(sql2, function(err2, rows2, fields2){
                        if(err2){return}
                        //console.log(rows2);
                        let sql3 = 'insert into schedules (uid,';
                        let vals = [];
                        for(var l = 0; l < rows2.length; l++){
                                sql3+='class'+(l+1)+','+'class'+(l+1)+'_name ,class'+(l+1)+'_section ,';
                                vals.push(rows2[l]['class_id']+','+'\''+rows2[l]['title']+'\','+rows2[l]['section']);
                        }
                        sql3 = sql3.slice(0, -1);
                        sql3+=') values (';
                        sql3+=req.body.uid+',';
                        for(var l = 0; l < vals.length; l++){
                                sql3+=vals[l]+',';
                        }
                        sql3 = sql3.slice(0, -1);
                        sql3+=')';
                        connection.query(sql3, function(err3, rows3, fields3){
                                if(err3){
                                        res.setHeader('Content-Type', 'application/json');
                                        res.end(JSON.stringify('you already have a schedule'));
                                return}
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify('schedule inserted'));
                                return;
                        })
                })
	
		})
	}
}
})
})

function writeSchedule(data){
var myRe = /Enrolled\t([A-Z]\d+)\s(\w+.*[A-Z]*)\s([\d\w]*)\t([\w-:& ]+)\t\d+.\d\t\w*\t[TBA]*([\w-]+)\s(\d{1,2}:\d{1,2}[ap]-\d{1,2}:\d{1,2}[ap])*/g
var matchedArray = data.match(myRe);

return (matchedArray);
}

function nthIndex(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

module.exports = router;
