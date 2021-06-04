var SignModel = require('../models/SignModel.js');
var fs = require("fs")
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
        var date = new Date();
        var fileName = "images/" + (date.toJSON().slice(0,10) + "_" + date.getHours() + "-" + date.getMinutes() + "-" + date.getMilliseconds()) + ".png";
        console.log(fileName)
        fs.writeFile("public/" + fileName, req.body.file, 'base64', function(err) {
            console.log(err);
        });
        
        var Sign = new SignModel({
			picture : fileName,
			description : req.body.description,
            longtitude : req.body.longtitude,
            latitude : req.body.latitude,
			date : Date()
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
			Sign.description = req.body.description ? req.body.description : Sign.description;
			
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
