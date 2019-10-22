var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

function writeSchedule(data){
  //regex for schedule parsing
  console.log('assigning variable');
  //var myRe = /Enrolled\t([A-Z]\d+)(\w+ \d+)[A-Z]*([\d\w]*)\t([\w-:& ]+)\t\d+.\d\t\w*\t[TBA]*([\w-]+) *(\d{1,2}:\d{1,2}[ap]-\d{1,2}:\d{1,2}[ap])*/;
  var myRe = /Enrolled/;
  console.log('matching array');
  var matchedArray = myRe.exec(data);
  console.log('executed matched array line');
  console.log(matchedArray);
  return('executed write');
}


router.post('/', urlencodedParser, function(req, res, next) {
    console.log('Recieved post request');
    let x = writeSchedule(req.body.schedule);
    console.log('Logging  X..');
    console.log(x);
    res.send(x);
});

module.exports = router;

