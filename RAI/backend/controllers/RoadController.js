var RoadModel = require('../models/RoadModel.js');

/**
 * RoadController.js
 *
 * @description :: Server-side logic for managing Roads.
 */
module.exports = {

    /**
     * RoadController.list()
     */
    list: function (req, res) {
        RoadModel.find(function (err, Roads) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Road.',
                    error: err
                });
            }

            return res.json(Roads);
        });
    },

    /**
     * RoadController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        RoadModel.findOne({_id: id}, function (err, Road) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Road.',
                    error: err
                });
            }

            if (!Road) {
                return res.status(404).json({
                    message: 'No such Road'
                });
            }

            return res.json(Road);
        });
    },

    /**
     * RoadController.create()
     */
    create: function (req, res) {
        var Road = new RoadModel({
            pathID: req.body.pathID,
			latitude : req.body.latitude,
			longtitude : req.body.longtitude,
			quality : req.body.quality,
            date : Date()
        });

        Road.save(function (err, Road) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Road',
                    error: err
                });
            }

            return res.status(201).json(Road);
        });
    },

    /**
     * RoadController.createList()
     */
    createList: function (req, res) {
        console.log(req.body);

        // var Road = new RoadModel({
        //     pathID: req.body.pathID,
		// 	latitude : req.body.latitude,
		// 	longtitude : req.body.longtitude,
		// 	quality : req.body.quality,
        //     date : Date()
        // });

        // Road.save(function (err, Road) {
        //     if (err) {
        //         return res.status(500).json({
        //             message: 'Error when creating Road',
        //             error: err
        //         });
        //     }

        //     return res.status(201).json(Road);
        // });
    },

    /**
     * RoadController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        RoadModel.findOne({_id: id}, function (err, Road) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Road',
                    error: err
                });
            }

            if (!Road) {
                return res.status(404).json({
                    message: 'No such Road'
                });
            }

            Road.latitude = req.body.startLatitude ? req.body.startLatitude : Road.startLatitude;
			Road.longtitude = req.body.startLongtitude ? req.body.startLongtitude : Road.startLongtitude;
			Road.quality = req.body.quality ? req.body.quality : Road.quality;

            Road.save(function (err, Road) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Road.',
                        error: err
                    });
                }

                return res.json(Road);
            });
        });
    },

    /**
     * RoadController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RoadModel.findByIdAndRemove(id, function (err, Road) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Road.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
