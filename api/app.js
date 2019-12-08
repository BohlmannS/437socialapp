var express = require('express');
var app = express()
var http = require('http').Server(app);
var login = require("./routes/login");
var register = require("./routes/registerrequest");
var myclasses = require("./routes/myclasses");
var friendclasses = require("./routes/friendclasses");
var inputschedule = require("./routes/inputschedule");
var friendrequest = require("./routes/friendrequest");
var frienddata = require("./routes/frienddata");
var deleteschedule = require("./routes/deleteschedule");
var frienddelete = require("./routes/frienddelete");
var iosmyclasses = require("./routes/iosmyclasses");
var verify = require("./routes/verify");
var reverify = require("./routes/reverify");
var friendsearch = require("./routes/friendsearch");
var gridview = require("./routes/gridview");

//app.use(express.urlencoded());
app.use(express.json());

app.use('*/js',express.static('public/js'));

app.use(express.static('public'));

app.get('/login', function(req, res){  
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/login.html');
});

//app.get('/login_style', function(req, res){
//	res.sendFile(__dirname + '/public/login_style.css');
//});

app.get('/home_index', function(req, res){  
  res.sendFile(__dirname + '/public/home_index.html');
});

app.get('/schedule_index', function(req, res){
	res.sendFile(__dirname + '/public/schedule_index.html');
});

app.get('/friends_index', function(req, res){
        res.sendFile(__dirname + '/public/friends_index.html');
});

app.get('/register', function(req, res){
	res.sendFile(__dirname + '/public/register.html');
});

app.use('/reverify', reverify);
app.use('/loginrequest', login);
app.use('/registerrequest', register);
app.use('/myclasses', myclasses);
app.use('/friendclasses', friendclasses);
app.use('/inputschedule', inputschedule);
app.use('/friendrequest', friendrequest);
app.use('/frienddata', frienddata);
app.use('/deleteschedule', deleteschedule);
app.use('/frienddelete', frienddelete);
app.use('/iosmyclasses', iosmyclasses);
app.use('/verify', verify);
app.use('/friendsearch', friendsearch);
app.use('/gridview', gridview);

http.listen(9000, function(){  console.log('listening on *:9000');});
