// insert a default student row with the firstname John, lastname Doe & random student_id.
// accepts any key-value pair from POST & GET and assign to the doc as well.
var exports = function(req, res) {
	var db = req.app.get('db');
	
	var id = req.query._id || req.query.id || req.body._id || req.body.id || "";
	
	var doc = {
		"firstname"	: "John",
		"lastname"	: "Doe",
		"studentId"	: generateStudentID()
	}
	
	if (id) doc._id = id;
	for (var key in req.body) {
		if (key === "_id" || key === "id") continue;
		doc[key] = req.body[key]
	}
	for (var key in req.query) {
		if (key === "_id" || key === "id") continue;
		doc[key] = req.query[key]
	}
	db.insert(doc, function(err, data) {
		if (err) {
			res.json({err:err});
			return;
		}

		res.json({doc:doc,data:data});
	});
};

// generate a random student ID
function generateStudentID() {
	return "ID#" + Math.floor(Math.random()*10000);
}

module.exports = exports;