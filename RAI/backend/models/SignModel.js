var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SignSchema = new Schema({
	'picture': String,
	'description': String,
	'longtitude' : Number,
	'latitude' : Number,
	'date': Date
});

module.exports = mongoose.model('Sign', SignSchema);