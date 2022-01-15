const { 
    v4: uuidv4,
  } = require('uuid');
const fetch = require("node-fetch");
var replaceAll = require("replaceall");
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
        console.log(req.body)
        var name = replaceAll("-","",uuidv4())
        var filePath = "images/" + name + ".png";

        fs.writeFile("public/" + filePath, req.body.file, 'base64', function(err) {
            console.log(err);
        });

        async function recogniseSign(){
            const result = await fetch('http://localhost:5000/recognise?image=' + name + ".png");
            var data = await result.json()

            if(data != null && await data.success === "true"){
                var Sign = new SignModel({
                    picture : filePath,
                    description : data.sign,
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
            }
            else{
                fs.unlinkSync("public/" + filePath);
            }
        }
        recogniseSign()
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

            fs.unlinkSync("public/" + Sign.picture)

            return res.status(204).json();
        });
    }
};
