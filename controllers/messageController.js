'use strict';

const messageModel = require('../models/messageModel');
//const resize = require('../utils/resize');
//const imageMeta = require('../utils/imageMeta');

const message_list_get = async (req, res) => {  //get all list to the main page
    const messages = await messageModel.getAllMessages();
    await res.json(messages);
};

const message_create_post = async (req, res) => {
   /* if (req.sender === undefined) {
        // redirect to login...
        window.alert('Cannot define the user.');
        window.location.replace('login.html');
        console.log('not authenticated?', req.sender);
    } else {*/
        try {
            const params = [
                req.body.sender,
                req.body.receiver,
                req.body.message,
                //coords
            ];
            console.log('Herere these: ', params);
            const response = await messageModel.addMessage(params);
            await res.json(response);
        } catch (e) {
            console.log('exif error controller issues wtf wtf', e);
            res.status(400).json({message: 'error wtf controller issues'});
        }

};

const message_get = async (req, res) => {  // get dog from user's input id
    const params = [req.params.id];
    const message = await messageModel.getMessage(params);
    await res.json(message[0]);
};

const message_delete = async (req, res) => {   //user or admin deletes dog
    if(req.user === undefined){
        window.location.replace('login.html');
    } else {
        const params = [req.params.id];
        const message = await messageModel.deleteMessage(params);
        await res.json(message);
    }
};


module.exports = {
    message_list_get,
    //dog_mylist_get,
    message_create_post,
    message_get,
    message_delete,
    //dog_update_put
};