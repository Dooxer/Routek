var TrafficeventModel = require('../models/TrafficEventModel.js');

/**
 * TrafficEventController.js
 *
 * @description :: Server-side logic for managing TrafficEvents.
 */
module.exports = {

    /**
     * TrafficEventController.list()
     */
    list: function (req, res) {
        TrafficeventModel.find().sort("-updated").exec(function (err, TrafficEvents) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficEvent.',
                    error: err
                });
            }

            return res.json(TrafficEvents);
        });
    },

    /**
     * TrafficEventController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        TrafficeventModel.findOne({_id: id}, function (err, TrafficEvent) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficEvent.',
                    error: err
                });
            }

            if (!TrafficEvent) {
                return res.status(404).json({
                    message: 'No such TrafficEvent'
                });
            }

            return res.json(TrafficEvent);
        });
    },

    /**
     * TrafficEventController.create()
     */
    create: function (req, res) {
        var TrafficEvent = new TrafficeventModel({
			id : req.body.id,
			title : req.body.title,
			updated : req.body.updated,
			summaryData : req.body.summaryData,
			category : req.body.category,
			trafficEventsHead : req.body.trafficEventsHead
        });

        TrafficEvent.save(function (err, TrafficEvent) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating TrafficEvent',
                    error: err
                });
            }

            return res.status(201).json(TrafficEvent);
        });
    },

    /**
     * TrafficEventController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        TrafficeventModel.findOne({_id: id}, function (err, TrafficEvent) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficEvent',
                    error: err
                });
            }

            if (!TrafficEvent) {
                return res.status(404).json({
                    message: 'No such TrafficEvent'
                });
            }

            TrafficEvent.id = req.body.id ? req.body.id : TrafficEvent.id;
			TrafficEvent.title = req.body.title ? req.body.title : TrafficEvent.title;
			TrafficEvent.updated = req.body.updated ? req.body.updated : TrafficEvent.updated;
			TrafficEvent.summaryData = req.body.summaryData ? req.body.summaryData : TrafficEvent.summaryData;
			TrafficEvent.category = req.body.category ? req.body.category : TrafficEvent.category;
			TrafficEvent.trafficEventsHead = req.body.trafficEventsHead ? req.body.trafficEventsHead : TrafficEvent.trafficEventsHead;
			
            TrafficEvent.save(function (err, TrafficEvent) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating TrafficEvent.',
                        error: err
                    });
                }

                return res.json(TrafficEvent);
            });
        });
    },

    /**
     * TrafficEventController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        TrafficeventModel.findByIdAndRemove(id, function (err, TrafficEvent) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the TrafficEvent.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
