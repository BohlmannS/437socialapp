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
    let sql = 'select username from users where uid <> ' + uid;
    //console.log('sql: ',sql);
    connection.query(sql, function(err, rows, fields){
        if(err){
                console.log("Error occured in query");
                //res.end(JSON.stringify('could not login'));
                return;
        }
    //console.log('This is rows: ', rows);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
    })

});

module.exports = router;
