// read a document specified by the id / _id in GET or POST
var exports = function(req, res) {
	var db = req.app.get('db');
	
	var id = req.query._id || req.query.id || req.body._id || req.body.id || "";
	if (id != "") {
		db.get(id, function(err, data) {
			if (err) {
				res.json({err:err});
				return;
			}

			res.json({data:data});
		});
	} else {
		res.json({err:"Please specify an id or _id to read"});
	}
};

module.exports = exports;