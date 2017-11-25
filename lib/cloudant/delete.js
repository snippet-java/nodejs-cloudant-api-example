// deletes a document from the student database based on the _id,
// accepts value from POST & GET
var exports = function(req, res) {
	var db = req.app.get('db');
	
	var id = req.query._id || req.query.id ||  req.body._id || req.body.id || "";

	if (id != "") {
		db.get(id, function(err, data) {
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
		res.json({err:"Please specify an id or _id to delete a document"});
	}
	
};

module.exports = exports;