const express = require('express');
const router = express.Router();
const database = require('../src/database/index');
const {Post, Tag} = database.models;

router.get('/', function (req, res) {
  Post.findAll({include:[{model: Tag, attributes: {exclude:'id'}}]}).then((data) => {
    let post = {};
    for(i in data){
      post[i] = (data[i]).toJSON();
    }
    res.render('home',{css:['_home.css'], post: post});
  });  
});

router.get('/about', function (req, res) {
  console.log("EXPRES============");
  console.log(req.sessionID);
  res.render('about');
});



module.exports = router;
 