'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

//This file contains functions to update the users table in the database
//Fetch info, update and delete

//get all users from database
const getAllMessages = async () => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM messages');
        return rows;
    } catch (e) {
        console.log('error', e.message);
        return {error: 'error in database query'};
    }
};

//get a single user info from database
const getMessage = async (params) => {
    console.log('still alive?', params);
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM messages WHERE id = ?;',
            //'SELECT username, email FROM users WHERE users.id = ?',
            [params],
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
        return {error: 'error in database query'};
    }
};

//add a new user into database
const addMessage = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?);',
            params,
        );
        return rows;
    } catch (e) {
        console.log('error', e.message);
        return {error: 'error in database query'};
    }
};

//delete user from database
const deleteMessage = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'DELETE FROM messages WHERE id = ?;',
            params);
        return rows;
    }
    catch (e) {
        console.log('error', e.message);
    }
};


module.exports = {
    getAllMessages,
    getMessage,
    addMessage,
    deleteMessage,
};
