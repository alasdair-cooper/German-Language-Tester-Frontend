/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

router.get('/sessions', async function (req, res, next) {
  const sessionKey = req.get('ApiAccessKey');
  const adminKey = req.get('ApiAdminKey');

  if (isNaN(sessionKey) | isNaN(adminKey) | sessionKey === null || adminKey === null) {
    res.status(405);
  }
  const response = await fetch('https://rapid-moose.azurewebsites.net/admin/sessions', {
    headers: {
      ApiAccessKey: sessionKey,
      ApiAdminKey: adminKey
    }
  }).then(async function (response) {
    if (response.ok) {
      const json = await response.json();
      res.send(json);
    } else if (response.status === 403) {
      res.status(403);
    } else if (response.status >= 500 | response.status === 404) {
      res.status(503);
    } else {
      res.status(500);
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      res.status(503);
    }
  });
});

router.get('/users', async function (req, res, next) {
  const sessionKey = req.get('ApiAccessKey');
  const adminKey = req.get('ApiAdminKey');

  if (isNaN(sessionKey) | isNaN(adminKey)) {
    res.status(405);
  }
  const response = await fetch('https://rapid-moose.azurewebsites.net/admin/users', {
    headers: {
      ApiAccessKey: sessionKey,
      ApiAdminKey: adminKey
    }
  }).then(async function (response) {
    if (response.ok) {
      const json = await response.json();
      res.send(json);
    } else if (response.status === 403) {
      res.status(403);
    } else if (response.status >= 500 | response.status === 404) {
      res.status(503);
    } else {
      res.status(500);
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      res.status(503);
    }
  });
});

module.exports = router;
