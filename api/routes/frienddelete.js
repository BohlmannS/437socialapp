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
    let sql = 'Select uid from users where username=\'' + req.body.friendName + '\'';
    connection.query(sql, function(err, rows, fields){
        if(err){
                console.log("Error occured in query");
                res.end(JSON.stringify({response: 10}));
                return;
        }
        if(rows.length !== 0){
                //console.log(rows);
                let greater = parseInt(req.body.uid,10);
                let less = rows[0].uid;
                //console.log(parseInt(greater,10));
                //console.log(less);
                if(rows[0].uid > req.body.uid){
                        greater = rows[0].uid;
                        less = parseInt(req.body.uid);
                }
                if(greater === less){
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({response: 1}));
                        return
                }
                else{
                let sql2 = 'delete from friends where lower='+less+' and greater='+greater;
                connection.query(sql2, function(err, rows2, fields){
                        if(err){
                                //console.log('Error occured in query');
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({response: 1}));
                                return;
                        }
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({response: 0}));
                })}
        }
        else{
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({response: 1}));
        }
    })

});

module.exports = router;

