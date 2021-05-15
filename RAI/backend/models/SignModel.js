var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SignSchema = new Schema({
	'picture': String,
	'description': String,
	'location': String,
	'date': Date
});

module.exports = mongoose.model('Sign', SignSchema);