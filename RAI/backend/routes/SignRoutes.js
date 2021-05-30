var express = require('express');
var router = express.Router();
var SignController = require('../controllers/SignController.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

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
// 'image' je ime pojla v katerem bo datoteka ob POST 
router.post('/',  SignController.create);

/*
 * PUT
 */
router.put('/:id', SignController.update);

/*
 * DELETE
 */
router.delete('/:id', SignController.remove);

module.exports = router;
