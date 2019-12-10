'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const breedController = require('../controllers/breedController');

router.get('/', breedController.breed_list_get);  //get all the dog on main page

router.get('/:type', breedController.breed_get);

module.exports = router;