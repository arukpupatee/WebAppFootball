var express = require('express'); //package for webframework with node
var app = express();
var path = require('path'); //package for path management
var mysql = require('mysql'); //pakage for connect MySQL (MariaDB Compatible)

//connect to Database
var connection = mysql.createConnection({
  	host     : '127.0.0.1', //port 3306 for MariaDB
  	user     : 'root',
	password : 'arttra88',
});
connection.connect(function(err){
	if (err) throw err
});
 
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/football', function (req, res) {
	res.sendFile(path.join(__dirname+'/football.html'));
});
app.get('/football/teams', function (req, res) {
	res.sendFile(path.join(__dirname+'/teams.html'));
});
app.get('/football/players', function (req, res) {
	res.sendFile(path.join(__dirname+'/players.html'));
});
app.get('/football/matches', function (req, res) {
	res.sendFile(path.join(__dirname+'/matches.html'));
});
/*
app.get('/football/teams/:col=:val/:table2', function(req, res){
	
});
*/

app.get('/db/:db/:table', function(req, res) {
	var db = req.params["db"];
	var table = req.params["table"];
	connection.query('USE '+db, function (err, rows, fields) {
  		if (err) throw err
	});
	connection.query('SELECT * FROM '+table, function (err, rows, fields) {
  		if (err) throw err
		res.json(rows)
	});
});
app.get('/db/:db/:table/:from-:to', function(req, res) {
	var db = req.params["db"];
	var table = req.params["table"];
	var from = req.params["from"] -1;
	var offset = req.params["to"] - from;
	connection.query('USE '+db, function (err, rows, fields) {
  		if (err) throw err
	});
	connection.query('SELECT * FROM '+table+' LIMIT '+from+','+offset, function (err, rows, fields) {
  		if (err) throw err
		res.json(rows)
	});
});
app.get('/db/:db/:table/where', function(req, res) {
	var db = req.params["db"];
	var table = req.params["table"];
	connection.query('USE '+db, function (err, rows, fields) {
  		if (err) throw err
	});
	select_query_string = "SELECT * FROM "+table;
	var count_query_string = 0;
	Object.keys(req.query).forEach(function(k){
		if (count_query_string == 0){
			select_query_string +=" WHERE "+k+"='"+req.query[k]+"'";
			count_query_string += 1;
		} else {
			select_query_string += " AND "+k+"='"+req.query[k]+"'";
			count_query_string += 1;
		}
	});
	connection.query(select_query_string, function (err, rows, fields) {
  		if (err) throw err
		res.json(rows)
	});
});
/*
app.get('/db/:db/:table1/:col=:val/:table2', function(req, res){
	var db = req.params["db"];
	connection.query('USE '+db, function (err, rows, fields) {
  		if (err) throw err
	});
	var table1 = req.params["table1"];
	var table2 = req.params["table2"];
	var column = req.params["col"];
	var value = req.params["val"];
	connection.query("SELECT * FROM "+table1+" INNER JOIN "+table2+" ON "+table1+"."+column+" = "+table2+"."+column+" WHERE "+table1+"."+column+"='"+value+"'", function (err, rows, fields) {
  		if (err) throw err
		res.json(rows)
	});
});
*/

app.listen(3000);
console.log("Running at Port 3000");