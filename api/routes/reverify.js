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
	let email = req.body.email;
	const x = checkExtension(email);
	if(x === true){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify('Please input your wustl email'));
		return;	
	}
	let index = email.indexOf('@');
	let username = email.substring(0, index);
	let token = crypto({length: 64, type: 'url-safe'});
	let sql = 'drop event if exists delete' + username;
	connection.query(sql, function(err, rows, fields){
		if(err){console.log(err)}
		let sql2 = 'delete from verification where username=\''+username+'\'';
		connection.query(sql2, function(err2, rows2, fields2){
			if(err2){console.log(err2)}
			let sql3 = 'insert into verification (username, token) values (\'' + username + '\',\'' + token + '\')';
			connection.query(sql3, function(err3, rows3, fields3){
				if(err3){console.log(err3)}
				let sql4 = 'create event delete' + username + ' on schedule at current_timestamp + interval 1 hour do delete from verification where username=\'' + username + '\'';
				connection.query(sql4, function(err4, rows4, fields4){
					if(err4){console.log(err4)}
					var mailOptions = {
						from: 'bearconnect123@gmail.com',
						to: email,
						subject: 'Verification for BearConnect',
						text: 'Please click the link below to verify your account. Link will expire in one hour. \n' + 'http://ec2-3-17-134-90.us-east-2.compute.amazonaws.com:3000/verify?token='+token
					}
					transporter.sendMail(mailOptions, function(error, info){
						if(error){
							console.log(error);
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify('Error sending verification email'));
							return;
						}
						res.setHeader('Content-Type', 'application/json');
						res.end(JSON.stringify('Verification email sent to ' + email + '. Please check your email to verify your account and get access to the site. If you do not see an email, check your spam inbox.'));
						return;1
					})	
				})
			})
		})
	})
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

