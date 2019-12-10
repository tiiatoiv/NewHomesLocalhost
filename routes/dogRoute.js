'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const dogController = require('../controllers/dogController');

router.get('/', dogController.dog_list_get);  //get all the dog on main page

router.get('/search/:breed/:size/:location', dogController.get_dog_search);  //get dogs which have been searched

router.get('/:id', dogController.dog_get);     //get specific dog

router.get('/owner', dogController.dog_mylist_get);

router.post('/', upload.single('dog'), dogController.dog_create_post);

router.put('/', dogController.dog_update_put);  //modified dog

router.delete('/:id', dogController.dog_delete);  //delete dog

module.exports = router;