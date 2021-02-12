var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/bootstrap.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, '../node_modules/bootstrap/dist/js/bootstrap.min.js'));
});

router.get('/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, '../node_modules/bootstrap/dist/css/bootstrap.min.css'));
});

router.get('/popper.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, '../node_modules/@popperjs/core/dist/umd/popper.min.js'));
});

router.get('/bootstrap.min.js.map', function (req, res) {
  res.sendFile(path.join(__dirname, '../node_modules/bootstrap/dist/js/bootstrap.min.js.map'));
});

router.get('/bootstrap.min.css.map', function (req, res) {
  res.sendFile(path.join(__dirname, '../node_modules/bootstrap/dist/css/bootstrap.min.css.map'));
});

router.get('/popper.min.js.map', function (req, res) {
  res.sendFile(path.join(__dirname, '../node_modules/@popperjs/core/dist/umd/popper.min.js.map'));
});

router.get('/jquery.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, '../node_modules/jquery/dist/jquery.slim.min.js'));
});

module.exports = router;
