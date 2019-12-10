'use strict';
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const user_list_get = async (req, res) => {
    console.log('get user or users', req.user);
    if(req.user){
        const user = await userModel.getUser(req.user.id);
        console.log('got user', user);
        await res.json(user[0]);
    } else {
        const users = await userModel.getAllUsers();
        await res.json(users);
    }
};

const user_list_get_all = async (req, res) => {
    const users = await userModel.getAllUsers();
    await res.json(users);
};

const user_get = async (req, res) => {
    const params = [req.params.id];
    const user = await userModel.getUserAnyone(params);
    await res.json(user[0]);
};

const user_get_by_name = async (req, res) => {
    const params = [req.params.username];
    const user = await userModel.getUserByName(params);
    await res.json(user[0]);
}

const user_create_account = async (req, res) => {
    console.log("account",req.body);
    const params = [
        req.body.username,
        req.body.email,
        req.body.phone,
        req.body.password,
    ];
    const response = await userModel.addUser(params);
    const user = await userModel.getUser([response.insertId]);
    await res.json(user);
};


const user_modify = async (req, res) => {
    const id = req.params.id

    let password = "";
    if (req.body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        password = hash;
    }

    const data = {
        id: id,
        username: req.body.username,
        password: password,
        email: req.body.email,
        phone: req.body.phone,   
    }
    console.log('update', data);
    const user = await userModel.updateUser(data);
    await res.json(user);
};

//check if username exits or not
const user_delete = async (req, res) => {
    const params = [req.params.id];
    console.log('delete', params);
    const user = await userModel.deleteUser(params);
    await res.json(user);
};


module.exports = {
    user_list_get,
    user_get,
    user_create_account,
    user_modify,
    user_delete,
    user_get_by_name,
    user_list_get_all
};
