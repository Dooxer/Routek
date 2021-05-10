var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RoadSchema = new Schema({
	'startLocation' : String,
	'endLocation' : String,
	'quality' : Number,
	'length' : Number
});

module.exports = mongoose.model('Road', RoadSchema);
