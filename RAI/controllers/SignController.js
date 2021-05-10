var SignModel = require('../models/SignModel.js');

/**
 * SignController.js
 *
 * @description :: Server-side logic for managing Signs.
 */
module.exports = {

    /**
     * SignController.list()
     */
    list: function (req, res) {
        SignModel.find(function (err, Signs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sign.',
                    error: err
                });
            }

            return res.json(Signs);
        });
    },

    /**
     * SignController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        SignModel.findOne({_id: id}, function (err, Sign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sign.',
                    error: err
                });
            }

            if (!Sign) {
                return res.status(404).json({
                    message: 'No such Sign'
                });
            }

            return res.json(Sign);
        });
    },

    /**
     * SignController.create()
     */
    create: function (req, res) {
        var Sign = new SignModel({
			picture : req.body.picture,
			Description : req.body.Description,
			Location : req.body.Location,
			Date : req.body.Date
        });

        Sign.save(function (err, Sign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Sign',
                    error: err
                });
            }

            return res.status(201).json(Sign);
        });
    },

    /**
     * SignController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        SignModel.findOne({_id: id}, function (err, Sign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Sign',
                    error: err
                });
            }

            if (!Sign) {
                return res.status(404).json({
                    message: 'No such Sign'
                });
            }

            Sign.picture = req.body.picture ? req.body.picture : Sign.picture;
			Sign.Description = req.body.Description ? req.body.Description : Sign.Description;
			Sign.Location = req.body.Location ? req.body.Location : Sign.Location;
			Sign.Date = req.body.Date ? req.body.Date : Sign.Date;
			
            Sign.save(function (err, Sign) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Sign.',
                        error: err
                    });
                }

                return res.json(Sign);
            });
        });
    },

    /**
     * SignController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        SignModel.findByIdAndRemove(id, function (err, Sign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Sign.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
