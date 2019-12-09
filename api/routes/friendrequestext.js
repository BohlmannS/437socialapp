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

router.post('/', function(req, res) {
	let uid=req.body.uid;
	let fname=req.body.friendName;
    let sql = 'Select uid from users where username=\'' + fname + '\'';
    connection.query(sql, function(err, rows, fields){
        if(err){
                console.log("Error occured in query");
                res.end(JSON.stringify({response: 10}));
                return;
        }
		let fid=rows[0].uid;
                let sql2 = 'insert into requests (req_from, req_to, status) values ('+uid+','+fid+',0)';
                connection.query(sql2, function(err, rows2, fields){
                        if(err){
                                //console.log('Error occured in query');
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({response: 1}));
                                return;
                        }
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({response: 0}));
                })
        })

});

module.exports = router;
