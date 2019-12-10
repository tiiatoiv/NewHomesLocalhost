'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();


//get all breed from database
const getAllBreeds = async () => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM dogtypes');
        return rows;
    } catch (e) {
        console.log('error', e.message);
        return {error: 'error in database query'};
    }
};

const getBreed = async (params) => {   //get dog to specific page
    try {
      const [rows] = await promisePool.execute(
          'SELECT * FROM dogtypes WHERE type = ?;',
          params,
      );
      return rows;
    } catch (e) {
      console.log('error', e.message);       //return error
      return {error: 'error in database query'};
    }
  };

module.exports = {
    getAllBreeds,
    getBreed
}