// deletes / drops the student database,
// accepts database name, dbname value from POST & GET
var exports = function(req, res) {
	var cloudant = req.app.get('cloudant');
	
	var name = req.query.tablename || req.body.tablename || req.query.dbname || req.body.dbname || "student";
	cloudant.db.destroy(name, function(err, data) {
		if (err) {
			res.json({err:err});
			return;
		}
		
		res.json({data:data});
	});
};

module.exports = exports;