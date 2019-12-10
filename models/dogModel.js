'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllDogs = async () => {
    try {
      const [rows] = await promisePool.execute(
        'SELECT dog.*, ROUND(DATEDIFF(CURRENT_DATE ,dob)/365) AS age, dogtypes.size FROM dog JOIN dogtypes ON dog.breed = dogtypes.type;');
      return rows;
    } catch (e) {
      console.log('error', e.message);
      return {error: 'error in database query'};
    }
  };

const getMyDogs = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT dog.*, ROUND(DATEDIFF(CURRENT_DATE ,dob)/365) AS age, dogtypes.size FROM dog JOIN dogtypes ON dog.breed = dogtypes.type WHERE owner = admin;');
        //        'SELECT ROUND(DATEDIFF(CURRENT_DATE ,dob)/365) AS age, users.username as ownername FROM dog JOIN users ON dog.owner = users.username WHERE dog.owner = randomuser;');
    return rows;
  } catch (e) {
    console.log('error', e.message);
    return {error: 'error in database query'};
  }
};

  const getDog = async (params) => {   //get dog to specific page
    try {
      const [rows] = await promisePool.execute(
          'SELECT * FROM dog WHERE id = ?;',
          params,
      );
      return rows;
    } catch (e) {
      console.log('error', e.message);       //return error
      return {error: 'error in database query'};
    }
  };

  const deleteDog = async (params) => {       //delete dog from admin and owner
    try {
      const [rows] = await promisePool.execute(
          'DELETE FROM dog WHERE id = ?;',
          params,
      );
      return rows;
    } catch (e) {
      console.log('error', e.message);
      return {error: 'error in database query'};
    }
  };
  
  const addDog = async (params) =>{  //user adds their dog
    try {
      const [rows] = await promisePool.execute(
          'INSERT INTO dog (name, dob, breed, owner, location, description, filename) VALUES (?,?,?,?,?,?,?);',
          params,
      );
      return rows;
    } catch (e) {
      console.log('error', e.message);
      return {error: 'error in database query'};
    }
  }
  
  const updateDog = async (params) =>{  //user or admin can update 
    try {
      const [rows] = await promisePool.execute(
          'UPDATE dog SET name = ?, dob = ?,  owner = ?, location = ? WHERE id = ?;',
          params,
      );
      return rows;
    } catch (e) {
      console.log('error', e.message);
      return {error: 'error in database query'};
    }
  }
  
const searchDog = async (params) => { //for searching favorite dog
  try {
    const [rows] = await promisePool.execute(
      'SELECT dog.*, dogtypes.size FROM dog JOIN dogtypes ON dog.breed = dogtypes.type WHERE dog.breed = ? OR dogtypes.size = ? OR dog.location = ?',
      params,
  );
    console.log(rows);
    return rows;
  } catch (e) {
    console.log('error', e.message);
}
}
  module.exports = {
    getAllDogs,
    getMyDogs,
    getDog,
    addDog,
    updateDog,
    deleteDog,
    searchDog
  };