var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TrafficEventsHeadSchema = new Schema({
	'title' : String,
	'subtitle' : String,
	'updated' : Date,
	'author' : String,
	'email' : String
});

module.exports = mongoose.model('TrafficEventsHead', TrafficEventsHeadSchema);
