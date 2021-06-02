var express = require('express');
var router = express.Router();
var TrafficEventsHeadController = require('../controllers/TrafficEventsHeadController.js');

/*
 * GET
 */
router.get('/', TrafficEventsHeadController.list);

/*
 * GET
 */
router.get('/:id', TrafficEventsHeadController.show);

/*
 * POST
 */
router.post('/', TrafficEventsHeadController.create);

/*
 * PUT
 */
router.put('/:id', TrafficEventsHeadController.update);

/*
 * DELETE
 */
router.delete('/:id', TrafficEventsHeadController.remove);

module.exports = router;
