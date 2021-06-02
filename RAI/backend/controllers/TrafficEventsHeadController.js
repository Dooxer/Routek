var TrafficeventsheadModel = require('../models/TrafficEventsHeadModel.js');

/**
 * TrafficEventsHeadController.js
 *
 * @description :: Server-side logic for managing TrafficEventsHeads.
 */
module.exports = {

    /**
     * TrafficEventsHeadController.list()
     */
    list: function (req, res) {
        TrafficeventsheadModel.find(function (err, TrafficEventsHeads) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficEventsHead.',
                    error: err
                });
            }

            return res.json(TrafficEventsHeads);
        });
    },

    /**
     * TrafficEventsHeadController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        TrafficeventsheadModel.findOne({_id: id}, function (err, TrafficEventsHead) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficEventsHead.',
                    error: err
                });
            }

            if (!TrafficEventsHead) {
                return res.status(404).json({
                    message: 'No such TrafficEventsHead'
                });
            }

            return res.json(TrafficEventsHead);
        });
    },

    /**
     * TrafficEventsHeadController.create()
     */
    create: function (req, res) {
        var TrafficEventsHead = new TrafficeventsheadModel({
			title : req.body.title,
			subtitle : req.body.subtitle,
			updated : req.body.updated,
			author : req.body.author,
			email : req.body.email
        });

        TrafficEventsHead.save(function (err, TrafficEventsHead) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating TrafficEventsHead',
                    error: err
                });
            }

            return res.status(201).json(TrafficEventsHead);
        });
    },

    /**
     * TrafficEventsHeadController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        TrafficeventsheadModel.findOne({_id: id}, function (err, TrafficEventsHead) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficEventsHead',
                    error: err
                });
            }

            if (!TrafficEventsHead) {
                return res.status(404).json({
                    message: 'No such TrafficEventsHead'
                });
            }

			TrafficEventsHead.title = req.body.title ? req.body.title : TrafficEventsHead.title;
			TrafficEventsHead.subtitle = req.body.subtitle ? req.body.subtitle : TrafficEventsHead.subtitle;
			TrafficEventsHead.updated = req.body.updated ? req.body.updated : TrafficEventsHead.updated;
			TrafficEventsHead.author = req.body.author ? req.body.author : TrafficEventsHead.author;
			TrafficEventsHead.email = req.body.email ? req.body.email : TrafficEventsHead.email;
			
            TrafficEventsHead.save(function (err, TrafficEventsHead) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating TrafficEventsHead.',
                        error: err
                    });
                }

                return res.json(TrafficEventsHead);
            });
        });
    },

    /**
     * TrafficEventsHeadController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        TrafficeventsheadModel.findByIdAndRemove(id, function (err, TrafficEventsHead) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the TrafficEventsHead.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
