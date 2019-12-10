'use strict';

const dogModel = require('../models/dogModel');
const resize = require('../utils/resize');

//const resize = require('../utils/resize');
//const imageMeta = require('../utils/imageMeta');

const dog_list_get = async (req, res) => {  //get all list to the main page
  const dogs = await dogModel.getAllDogs();
  await res.json(dogs);
};

const dog_mylist_get = async (req, res) => {  //get all list to the main page
  const dogs = await dogModel.getMyDogs();
  await res.json(dogs);
};

const dog_create_post = async (req, res) => {
  if(req.user === undefined) {
    // redirect to login...
    window.location.replace('login.html');
    console.log('not authenticated?', req.user);
  } else {
    try{
       await resize.makeThumbnail(req.file.path,
        'thumbnails/' + req.file.filename,
        {width: 160, height: 160});

      const params = [
        req.body.name,
        req.body.dob,
        req.body.breed,
        req.body.owner,
        req.body.location,
          req.body.description,
        req.file.filename,
      ];
      const response = await dogModel.addDog(params);
      await res.json(response);
  } catch (e){
    console.log('exif error controller issues wtf wtf', e);
    res.status(400).json({message: 'error wtf controller issues'});
  }
}};

const dog_get = async (req, res) => {  // get dog from user's input id
  const params = [req.params.id];
  const dog = await dogModel.getDog(params);
  await res.json(dog[0]);
};

const dog_delete = async (req, res) => {   //user or admin deletes dog
  if(req.user === undefined){
    window.location.replace('login.html');
  } else {
    const params = [req.params.id];
    const dog = await dogModel.deleteDog(params);
    await res.json(dog);
  }
};

const dog_update_put = async (req,res) => {  //user or admin updates dog
  if(req.user === undefined){
    window.location.replace('login.html');
  } else {
    const params = [
      req.body.name,
      req.body.age,
      req.body.location, 
      req.body.owner,
    ]
    const response = await dogModel.updateDog(params);
    await res.json(response);
  }
}

const get_dog_search = async (req,res) => {
  console.log('search', req.params);
  try {
    const params = [
      req.params.breed,
      req.params.size,
      req.params.location,
    ];
    const response = await dogModel.searchDog(params);
    await res.json(response);
  } catch (e) {
     console.log(e.message);
  }
}

module.exports = {
    dog_list_get,
    dog_mylist_get,
    dog_create_post,
    dog_get,
    dog_delete,
    dog_update_put,
    get_dog_search
  };