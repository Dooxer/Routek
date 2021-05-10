var express = require('express');
var router = express.Router();
var SignController = require('../controllers/SignController.js');

/*
 * GET
 */
router.get('/', SignController.list);

/*
 * GET
 */
router.get('/:id', SignController.show);

/*
 * POST
 */
router.post('/', SignController.create);

/*
 * PUT
 */
router.put('/:id', SignController.update);

/*
 * DELETE
 */
router.delete('/:id', SignController.remove);

module.exports = router;
