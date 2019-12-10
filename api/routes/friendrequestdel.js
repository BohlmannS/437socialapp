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
                        let sql3 = 'delete from requests where req_to=\''+req.body.uid+'\' and req_from=\''+rows[0].uid+'\'';
                        connection.query(sql3, function(err3, rows3, fields3){
                                if(err3){return}
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({response: 0}));
                        })

})});

module.exports = router;

