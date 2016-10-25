var express = require('express');
var http = require('http');
var app = express();

var bodyParser = require('body-parser');

var Cloudant = require('cloudant');

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 

var services = JSON.parse(process.env.VCAP_SERVICES) || {};

var cloudantCreds = {};
for (var serviceName in services) {
	if (serviceName.indexOf("cloudantNoSQLDB") > -1) {
		cloudantCreds = services[serviceName][0]['credentials'];
	}
}
var config = require("./config.json");

var cloudant = Cloudant({
	account : cloudantCreds.username || config.cloudant.username || "", 
	password : cloudantCreds.password || config.cloudant.password || ""
});

var db = cloudant.db.use(config.cloudant.dbName);

app.all(["/createdb"], function(req, res) {
	// by default, will create a collection called student
	// or accepts dbname value from from POST or GET
	var name = req.query.dbname || req.body.dbname || config.cloudant.dbName || "";
	cloudant.db.create(name, function(err, data) {
		if (err) {
			res.json({err:err});
			return;
		}
		
		db = cloudant.db.use(name);
		
		res.json({data:data});
	});
})

app.get(["/create","/insert","/add"], function(req, res) {
	//creates a default student document with the name John & random studentId.
	//accepts any key-value pair from POST & GET and assign to the doc as well.
	var _id = req.query._id || req.query.id || req.body._id || req.body.id || "";
	
	// remove all ids from query and body
	delete(req.query._id);
	delete(req.query.id);
	delete(req.body._id);
	delete(req.body.id);
	
	var doc = {
		"name" : "John",
		"studentId" : generateStudentID()
	}
	
	if (_id) doc._id = _id
	for (var key in req.body) {
		doc[key] = req.body[key]
	}
	for (var key in req.query) {
		doc[key] = req.query[key]
	}
	db.insert(doc, function(err, data) {
		if (err) {
			res.json({err:err});
			return;
		}

		res.json({doc:doc,data:data});
	});
})

app.all(["/list"], function(req, res) {
	//list out all the documents header in the student collection
	db.list(function(err, data) {
		if (err) {
			res.json({err:err});
			return;
		}
		
		res.json({data:data});
	});
})

app.all(["/read","/get"], function(req, res) {
	//read a document specified by the id in GET or POST.
	//If none is specified, will read a random document from the list.
	var _id = req.query._id || req.query.id || req.body._id || req.body.id || "";
	if (_id != "") {
		db.get(_id, function(err, data) {
			if (err) {
				res.json({err:err});
				return;
			}

			res.json({data:data});
		});
	} else {
		getRandomDocument(function(err, data) {
			if (err) {
				res.json({err:err});
				return;
			}

			res.json({data:data});
		});
	}
})

app.all(["/update","/modify"], function(req, res) {
	//updates a student document based on the id with a random studentId.
	//accepts any key-value pair from POST & GET and assign to the doc as well.
	var _id = req.query._id || req.query.id || req.body._id || req.body.id || "";
	
	// remove all ids from query and body
	delete(req.query._id);
	delete(req.query.id);
	delete(req.body._id);
	delete(req.body.id);
	if (_id != "") {
		db.get(_id, function(err, data) {
			if (err) {
				res.json({err:err});
				return;
			}

			var old_doc = data;
			var doc = data;
			doc["studentId"] = generateStudentID();
			for (var key in req.body) {
				doc[key] = req.body[key];
			}
			for (var key in req.query) {
				doc[key] = req.query[key];
			}
			
			// use insert to modify existing doc by id, if there's any,
			// otherwise it'll create new doc
			db.insert(doc, function(err, data) {
				if (err) {
					res.json({err:err});
					return;
				}
	
				res.json({old_doc:old_doc,doc:doc,data:data});
			});
		});
	} else {
		getRandomDocument(function(err, data) {
			if (err) {
				res.json({err:err});
				return;
			}
			
			var old_doc = data;
 			var doc = data;
			for (var key in req.body) {
				doc[key] = req.body[key]
			}
			for (var key in req.query) {
				doc[key] = req.query[key]
			}
			
			// use insert to modify existing doc by id, if there's any,
			// otherwise it'll create new doc
			db.insert(doc, function(err, data) {
				if (err) {
					res.json({err:err});
					return;
				}	

				res.json({old_doc:old_doc,doc:doc,data:data});
			});
		});
	}
})


app.all(["/delete","/destroy","/remove"], function(req, res) {
	// deletes a student document based on the id,
	// otherwise, randomly delete 1 document
	// accepts value from POST & GET
	var _id = req.query._id || req.query.id ||  req.body._id || req.body.id || "";

	if (_id != "") {
		db.get(_id, function(err, data) {
			if (err) {
				res.json({err:err});
				return;
			}
			
			var doc = data;
			db.destroy(doc._id, doc._rev, function(err, data) {
				if (err) {
					res.json({err:err});
					return;
				}
				
				res.json({deleted_doc:doc,data:data});
			});
		});
	} else {
		getRandomDocument(function(err, data) {
			if (err) {
				res.json({err:err});
				return;
			}

			var doc = data;
			db.destroy(doc._id, doc._rev, function(err, data) {
				if (err) {
					res.json({err:err});
					return;
				}

				res.json({deleted_doc:doc,data:data});
			});
		});
	}
})


function generateStudentID() {
	return "ID#" + Math.floor(Math.random()*10000);
}

// get a random document from the list if no specific document id is selected
function getRandomDocument(cb) {
	db.list(function(err, data) {
		if (err) {
			cb(err,null);
			return;
		}
		
		//get a random document from the list
		if (data.rows) {
			var doc = data.rows[Math.floor(data.rows.length*Math.random())];
			db.get(doc.id, function(err, data) {
				if (err) {
					cb(err,null);
					return;
				}

				cb(null,data,doc);
			});
		} else {
			cb("collection is empty",null);
		}
	});
}

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

require("cf-deployment-tracker-client").track();