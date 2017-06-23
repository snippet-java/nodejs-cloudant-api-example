// by default, will create a student database
var exports = function(req, res) {
	var cloudant = req.app.get('cloudant');
	
	var dbname = req.query.dbname || req.body.dbname || "student";
	cloudant.db.create(dbname, function(err, data) {
		if (err) {
			res.json({err:err});
			return;
		}
		
		var db = cloudant.db.use(dbname);
		req.app.set('db', db)
		
		res.json({data:data});
	});
};

module.exports = exports;