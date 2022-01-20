var express = require('express');
var router = express.Router();
var RoadController = require('../controllers/RoadController.js');

/*
 * GET
 */
router.get('/', RoadController.list);
router.get("/analyze", RoadController.analyze)

/*
 * GET
 */
router.get('/:id', RoadController.show);

/*
 * POST
 */
router.post('/', RoadController.create);

/*
 * POST
 */
router.post('/list', RoadController.createList);

/*
 * PUT
 */
router.put('/:id', RoadController.update);

/*
 * DELETE
 */
router.delete('/:id', RoadController.remove);

module.exports = router;
