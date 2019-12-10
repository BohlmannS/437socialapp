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
        let sql = 'select greater from friends where lower=' + req.body.uid + ' union select lower from friends where greater='+req.body.uid;
        connection.query(sql, function(err, rows, fields){
                if(err){
                        res.end(JSON.stringify('no friends'));
                        return;
                }
                //query returns an array with objects with one prop: greater and the id num of a friend
                let ids = [];
                rows.forEach(function(element){
			for(var prop1 in element){
				ids.push(element[prop1]);
			}
		});
		//all the ids stored in ids array
		let fString = '';
		for(var i = 0; i < ids.length; i++){
			fString += 'uid=' + ids[i] + ' or ';
		}
		fString = fString.slice(0, -3);
		let sql2 = 'select uid, username, first_name, last_name from users where (' + fString + ')';
		connection.query(sql2, function(err2, rows2, fields2){
			if(err2){
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify([]));
			return;
			}		
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(rows2));
			})
		})
})


module.exports = router;
