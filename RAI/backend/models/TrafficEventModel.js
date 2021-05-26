var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TrafficEventSchema = new Schema({
	'id' : Number,
	'title' : String,
	'updated' : Date,
	'summary' : String,
	'category' : String,
	'trafficEventsHead' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'TrafficEventsHead'
	}
});

module.exports = mongoose.model('TrafficEvent', TrafficEventSchema);
