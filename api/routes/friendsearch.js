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
//	console.log(req.body);
        let uid = req.body.uid;
    let sql = 'select uid, username, first_name, last_name from users where uid <> ' + uid;
    //console.log('sql: ',sql);
    connection.query(sql, function(err, rows, fields){
        if(err){
                console.log("Error occured in query");
                //res.end(JSON.stringify('could not login'));
                return;
        }
    //console.log('This is rows: ', rows);
    let sql2 = 'select greater from friends where lower=' + req.body.uid + ' union select lower from friends where greater='+req.body.uid;
	connection.query(sql2, function(err2, rows2, f2){
	let response = [];	
	let ids= [];
	rows2.forEach(function(e){
		for(var prop1 in e){
			ids.push(e[prop1]);
		}
	})
	rows.forEach(function(e){
		if(ids.includes(e.uid)){}
		else{
			response.push({username: e.username, first_name: e.first_name, last_name: e.last_name});
		}
	})
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
    })})

});

module.exports = router;
