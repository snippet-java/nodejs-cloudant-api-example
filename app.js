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

//==== CONFIGURE DATABASE ======================================//
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var cloudantCreds = {};
for (var serviceName in services) {
	if (serviceName.indexOf("cloudantNoSQLDB") > -1) {
		cloudantCreds = services[serviceName][0]['credentials'];
	}
}

var services = {cloudant:{}};
if (JSON.stringify(cloudantCreds) == "{}") {
	services = require("./services.json");
}

var dbConfig = {
	account : cloudantCreds.username || services.cloudant.username || "", 
	password : cloudantCreds.password || services.cloudant.password || "",
	dbName : services.cloudant.dbName || "student"
};

var cloudant = Cloudant(dbConfig);
var db = cloudant.db.use(dbConfig.dbName);
app.set('cloudant', cloudant);
app.set('db', db);
var db = require('./lib/cloudant/db.js');
//==============================================================//

//==== CREATE STUDENT DATABASE =================================//
// curl <url>/cloudant/createdb                                 //
//==============================================================//
app.all(db.paths.createDB, db.createDB);

//==== CREATE / INSERT DOCUMENT ================================//
// curl <url>/cloudant/set                                      //
//==============================================================//
app.all(db.paths.create, db.create);

//==== LIST ALL DOCUMENTS IN DATABASE ==========================//
// curl <url>/cloudant/list                                     //
//==============================================================//
app.all(db.paths.list, db.list);

//==== READ 1 DOCUMENT BASED ON ID =============================//
// curl <url>/cloudant/get?id=3                                 //
//==============================================================//
app.all(db.paths.read, db.read);

//==== UPDATE 1 DOCUMENT BASED ON ID ===========================//
// curl <url>/cloudant/update?id=3&firstname=Bob&lastname=Peter //
//==============================================================//
app.all(db.paths.update, db.update);

//==== DELETE 1 DOCUMENT BASED ON ID ===========================//
// curl <url>/cloudant/delete?id=3                              //
//==============================================================//
app.all(db.paths.delete_, db.delete_);

//==== DELETE / DROP STUDENT DATABASE===========================//
// curl <url>/cloudant/deletedb                                 //
//==============================================================//
app.all(db.paths.deleteDB, db.deleteDB);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

require("cf-deployment-tracker-client").track();