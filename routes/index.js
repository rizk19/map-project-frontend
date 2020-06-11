var express = require('express');
var router = express.Router();

module.exports = () => {

  router.get('/', function (req, res, next) {
    let nav = 1
    res.render('index', { title: "Noto Maps", nav });
  })

  router.get('/table', function (req, res, next) {
    let nav = 2
    res.render('table', { title: "Noto Table", nav });
  })

  return router
};

/* GET home page. */

