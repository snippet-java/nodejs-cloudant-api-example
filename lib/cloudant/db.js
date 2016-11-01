var createTable	= require('./createTable.js');
var create		= require('./create.js');
var list		= require('./list.js');
var read		= require('./read.js');
var update		= require('./update.js');
var delete_		= require('./delete.js');
var deleteTable	= require('./deleteTable.js');

var path = "/cloudant/";
var paths = {
	createDB	: [path+"createdb",path+"createtable"],
	createTable	: [path+"createdb",path+"createtable"],
	create		: [path+"set",path+"create",path+"insert",path+"add"],
	list		: [path+"list"],
	read		: [path+"get",path+"read"],
	update		: [path+"update",path+"modify"],
	delete_		: [path+"delete",path+"destroy",path+"remove"],
	deleteDB	: [path+"deletedb",path+"deletetable",path+"droptable",path+"destroytable",path+"removetable"],
	deleteTable	: [path+"deletedb",path+"deletetable",path+"droptable",path+"destroytable",path+"removetable"]
};

var exports = {
	paths		: paths,
	createTable	: createTable,
	createDB	: createTable,
	create		: create,
	list		: list,
	read		: read,
	update		: update,
	delete_		: delete_,
	deleteDoc	: delete_,
	deleteRow	: delete_,
	deleteDB	: deleteTable,
	deleteTable	: deleteTable
}

module.exports = exports;
