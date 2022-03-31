//////////////////////////////////////////////////////
//
// Write an HTTP server that serves JSON data when it
// receives a GET request to the path '/api/score'.
//
//////////////////////////////////////////////////////
var http = require('http');
var url = require('url');
var mongodb = require('mongodb');
const {
  MONGO_URL,
  MONGO_DATABASE
}  = process.env;
// - Expect the request to contain a query
//   string with a key 'student_id' and a student ID as
//   the value. For example
//     /api/score?student_id=1111
// - The JSON response should contain only 'student_id', 'student_name'
//   and 'student_score' properties. For example:
//
//     {
//       "student_id": 1111,
//       "student_name": Bruce Lee,
//       "student_score": 84
//     }
//

var MongoClient = mongodb.MongoClient;
var uri = `mongodb://${MONGO_URL}/${MONGO_DATABASE}`;
// Connect to the db
console.log(uri);

var server = http.createServer(function (req, res) {
  var result;
  // req.url = /api/score?student_id=11111
  var parsedUrl = url.parse(req.url, true);

  var student_id = parseInt(parsedUrl.query.student_id);

  // match req.url with the string /api/score
  if (/^\/api\/score/.test(req.url)) {
    // e.g., of student_id 1111
    
    MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, client){
    	if (err)
           throw err;
    	var db = client.db("studentdb");
    	db.collection("students").findOne({"student_id":student_id}, (err, student) => {
	   if(err) 
		throw new Error(err.message, null);
    	   
	   if (student) {
  		res.writeHead(200, { 'Content-Type': 'application/json' })
  		res.end(JSON.stringify(student)+ '\n')
  	   }else {
	   	res.writeHead(404);
		res.end("Student Not Found \n");
	   }
	});
    });
  } else {
  res.writeHead(404);
  res.end("Wrong url, please try again\n");
  } 	
});
server.listen(8080);
