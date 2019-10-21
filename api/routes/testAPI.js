var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', urlencodedParser, function(req, res, next) {
    console.log('Logging request body');
    console.log(req.body.username);
    res.send('API has recieved: ' + req.body);
});

module.exports = router;
