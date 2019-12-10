'use strict';
const breedModel = require('../models/breedModel');

const breed_list_get = async (req, res) => {
    const breeds = await breedModel.getAllBreeds();
    await res.json(breeds);
};

const breed_get = async (req, res) => {
    const params = [req.params.type];
    const breed = await breedModel.getBreed(params);
    await res.json(breed[0]);
};

module.exports = {
    breed_list_get,
    breed_get
};