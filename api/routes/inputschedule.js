var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'database-1.csbhhsidcs3g.us-east-2.rds.amazonaws.com',
  port : 3306,
  user : 'admin',
  password : 'bohlmannsbohlmanns',
  database : 'main_site'
});

connection.connect(function(err) {
  if(err){
    console.log(err.code);
    console.log(err.fatal);
    console.log('error: ' + err.message);
    return;
  }
});

router.post('/', function(req, res){
	const x = writeSchedule(req.body.schedule);
	console.log(x);
	console.log('done');
})

function writeSchedule(data){
var myRe = /Enrolled\t([A-Z]\d+)\s(\w+.*[A-Z]*)\s([\d\w]*)\t([\w-:& ]+)\t\d+.\d\t\w*\t[TBA]*([\w-]+)\s(\d{1,2}:\d{1,2}[ap]-\d{1,2}:\d{1,2}[ap])*/g
var matchedArray = myRe.exec(data);
console.log('matched line');
console.log(matchedArray);
return (matchedArray);
}

module.exports = router;
