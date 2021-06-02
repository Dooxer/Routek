var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RoadSchema = new Schema({
	'pathID' : String,
	'latitude' : Number,
	'longtitude' : Number,
	'quality' : Number,
	'date' : Date
});

module.exports = mongoose.model('Road', RoadSchema);