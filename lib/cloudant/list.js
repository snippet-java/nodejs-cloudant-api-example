// list out all the documents header in the student database
var exports = function(req, res) {
	var db = req.app.get('db');
	
	db.list(function(err, data) {
		if (err) {
			res.json({err:err});
			return;
		}
		
		res.json({data:data});
	});
};

module.exports = exports;