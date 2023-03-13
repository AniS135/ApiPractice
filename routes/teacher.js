const express=require('express');
const router=express.Router();

const teachersController = require('../controllers/teachers_controller');


router.post('/register', teachersController.register);
router.get('/', teachersController.list);

module.exports = router;