var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('./config.js');
const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require('crypto-random-string');

var connection = mysql.createConnection(config);

connection.connect(function(err) {
  if(err){
    console.log(err.code);
    console.log(err.fatal);
    console.log('error: ' + err.message);
    return;
  }
});

var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
                user: 'bearconnect123@gmail.com',
                pass: process.env.GMAILPASS
                }
});

router.post('/', function(req, res) {
	
});

//returns true if user's email is NOT an @wustl.edu email address
function checkExtension(data){
        var index = data.indexOf('@');
        if(index === -1)
                return true;
        var ext = data.substring(index + 1);
        if(ext === 'wustl.edu');
                return false;
        return true;
}


module.exports = router;

