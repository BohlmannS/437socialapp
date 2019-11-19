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
		res.end(JSON.stringify('Please register with your wustl email'));
		return;
	}
	let index = email.indexOf('@');
	let username = email.substring(0, index);
	let password = req.body.password;
	let fname = req.body.fname;
	let lname = req.body.lname;
	let token = crypto({length: 64, type: 'url-safe'});
    let sql = 'insert into users (username, password, verified, email, first_name, last_name) values (\'' + username + '\',\'' + password + '\',0,\''+ email + '\',\'' + fname + '\',\'' + lname + '\')';
    	//console.log(sql);
	connection.query(sql, function(err, rows, fields){
        if(err){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify('Username/Email already registered'));
		return;
        }
	let sql2 = 'drop event if exists delete' + username;
	//console.log(sql2);
	connection.query(sql2, function(err2, rows2, fields2){
		if(err2){console.log(err2)}
		let sql3 = 'create event delete' + username + ' on schedule at current_timestamp + interval 1 hour do delete from verification where username=\'' + username + '\'';
		//console.log(sql3);
		connection.query(sql3, function(err3, rows3, fields3){
			if(err3){console.log(err3)}
		let sql4 = 'insert into verification (username, token) values (\'' + username + '\',\'' + token + '\')';
		//console.log(sql4);
		connection.query(sql4, function(err4, rows4, fields4){
			if(err4){console.log(err4)}
			var mailOptions = {
        			from: 'bearconnect123@gmail.com',
        			to: email,
        			subject: 'Verification for BearConnect',
        			text: 'Please Click the link below to verify your account. Link will expire in one hour. \n' + 'http://ec2-3-17-134-90.us-east-2.compute.amazonaws.com:3000/verify?token='+token
			};
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify('Error sending verification email'));
					return;
				}
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify('Verification email sent to ' + email + '. Please check your email to verify your account and get access to the site. If you do not see an email, check your spam inbox.'));
				return;
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

