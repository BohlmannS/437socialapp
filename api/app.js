var express = require('express');
var app = express()
var http = require('http').Server(app);
var testDBRouter = require("./routes/testDB");
var login = require("./routes/login");
//app.use(express.urlencoded());
app.use(express.json());

app.use('*/js',express.static('public/js'));

app.get('/login', function(req, res){  
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/home', function(req, res){  
  res.sendFile(__dirname + '/public/home.html');
});

app.use('/testDB', testDBRouter);
app.use('/loginrequest', login);


http.listen(3000, function(){  console.log('listening on *:3000');});
