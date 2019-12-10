'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
//const upload = multer({dest: 'uploads/'});
const userController = require('../controllers/userController');

router.get('/', userController.user_list_get);  //get logged in users or all of the users

router.get('/all', userController.user_list_get_all); //get all of the users 

router.get('/name/:username', userController.user_get_by_name); // get user by username

router.get('/name/:username', userController.user_get_by_name); // get user by username

router.get('/:id', userController.user_get); //get certain user

router.post('/', userController.user_create_account);

router.delete('/:id', userController.user_delete);

router.put('/:id', userController.user_modify);

module.exports = router;