var express = require('express');
var router = express.Router();
var TrafficEventController = require('../controllers/TrafficEventController.js');

/*
 * GET
 */
router.get('/', TrafficEventController.list);

/*
 * GET
 */
router.get('/:id', TrafficEventController.show);

/*
 * POST
 */
router.post('/', TrafficEventController.create);

/*
 * PUT
 */
router.put('/:id', TrafficEventController.update);

/*
 * DELETE
 */
router.delete('/:id', TrafficEventController.remove);

module.exports = router;
