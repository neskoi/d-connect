'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const dbSync =  require(path.join(__dirname,'sync'));

let database = null;

const loadModels = (sequelize) => {
  const dir = path.join(__dirname, '/models');
  let models = [];
  fs.readdirSync(dir).forEach(file => {
    const modelDir = path.join(dir, file),
    model = sequelize.import(modelDir);
    models[model.name] = model;
  });
  return models;
};

const associateModels = (models) => {
  for(var assoc in models){
    if(models[assoc].associate){
      models[assoc].associate(models);   
    }
  }
  console.log('Database associations finished.');
}

if(!database){
  const sequelize = new Sequelize(dbConfig);
  database = {
    sequelize,
    Sequelize,
    models:[]
  };
  database.models = loadModels(sequelize);  
  dbSync(database)
    .then(()=>{
      associateModels(database.models);
      console.log('Database synchronization finished.');
    })
    .catch((err)=>console.log(err));
}

module.exports = database;
