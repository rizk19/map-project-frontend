var express = require('express');
var router = express.Router();

module.exports = () => {

  router.get('/', function (req, res, next) {
    let nav = 1
    res.render('index', { title: "Noto Maps", nav });
  })

  return router
};

/* GET home page. */

