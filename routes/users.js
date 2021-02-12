/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var path = require('path');
var fs = require('fs');

router.post('/create', async function (req, res, next) {
  const userCredentials = JSON.stringify(req.body);

  await fetch('https://rapid-moose.azurewebsites.net/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: userCredentials
  }).then(async function (response) {
    if (response.status === 403) {
      res.status(403).send();
    } else if (response.status >= 500 | response.status === 404) {
    }
  });

  let sessionId = -1;

  await fetch('https://rapid-moose.azurewebsites.net/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: userCredentials
  }).then(async function (response) {
    if (response.status === 403) {
      res.status(403);
    } else if (response.status >= 500 | response.status === 404) {
    }
    sessionId = await response.text();
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      sessionId = -1;
    }
  });

  await fetch('https://rapid-moose.azurewebsites.net/files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ApiAccessKey: sessionId
    },
    body: JSON.stringify(newUserFile())
  }).then(async function (response) {
    if (response.ok) {
      res.send(sessionId);
    } else if (response.status === 403) {
      res.status(403);
    } else if (response.status >= 500 | response.status === 404) {
      writeScoreJson(JSON.stringify(newUserFile()));
    } else {
      res.status(500);
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      writeScoreJson(JSON.stringify(newUserFile()));
    }
  });
});

router.post('/login', async function (req, res, next) {
  const userCredentials = JSON.stringify(req.body);
  const response = await fetch('https://rapid-moose.azurewebsites.net/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: userCredentials
  });
  if (response.ok) {
    const sessionId = await response.text();
    res.send(sessionId);
  } else {
    res.status(500).send();
  }
});

router.get('/score/download', async function (req, res, next) {
  const response = await fetch('https://rapid-moose.azurewebsites.net/files', {
    method: 'GET',
    headers: {
      ApiAccessKey: req.get('ApiAccessKey')
    }
  }).then(async function (response) {
    if (response.ok) {
      const data = await response.json();
      writeScoreJson(JSON.stringify(data));
      res.send(data);
    } else if (response.status === 403) {
      res.status(403);
    } else if (response.status >= 500 | response.status === 404) {
      res.send(newUserFile());
    } else {
      res.status(500);
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      const userScoreFile = require(path.join(__dirname, '/score.json'));
      res.send(userScoreFile);
    }
  });
});

router.get('/icon/download', async function (req, res, next) {
  const response = await fetch('https://rapid-moose.azurewebsites.net/images', {
    method: 'GET',
    headers: {
      ApiAccessKey: req.get('ApiAccessKey')
    }
  }).then(async function (response) {
    if (response.ok) {
      const data = await response.blob();
      res.type(response.headers.get('content-type'));
      data.arrayBuffer().then((buf) => {
        res.send(Buffer.from(buf));
      });
    } else if (response.status === 403) {
      res.status(403);
    } else {
      res.sendFile(path.join(__dirname, './LLanguage Llama.png'));
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      res.sendFile(path.join(__dirname, './LLanguage Llama.png'));
    }
  });
});

router.post('/score/upload', async function (req, res, next) {
  const response = await fetch('https://rapid-moose.azurewebsites.net/files', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ApiAccessKey: req.get('ApiAccessKey')
    },
    body: JSON.stringify(req.body)
  }).then(function (response) {
    console.log(response.status);
    if (response.ok) {
      res.status(204).send();
    } else if (response.status === 403) {
      res.status(403).send();
    } else if (response.status >= 500 | response.status === 404) {
      writeScoreJson(JSON.stringify(req.body));
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      writeScoreJson(JSON.stringify(req.body));
      res.status(204).send();
    }
  });
});

router.post('/icon/upload', async function (req, res, next) {
  const response = await fetch('https://rapid-moose.azurewebsites.net/images', {
    method: 'POST',
    headers: {
      ApiAccessKey: req.get('ApiAccessKey'),
      'Content-Type': req.get('Content-Type')
    },
    body: req.body
  }).then((response) => {
    if (response.ok) {
      res.status(204).send();
    } else if (response.status === 403) {
      res.status(403).send();
    } else if (response.status >= 500 | response.status === 404) {
      res.status(503).send();
    } else {
      res.status(500).send();
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      res.status(503).send();
    }
  });
});

function newUserFile () {
  const scoreJson = {};
  scoreJson.retention = {};
  scoreJson.scores = {};
  scoreJson.settings = {};
  return (scoreJson);
}

async function writeScoreJson (json) {
  fs.writeFile(path.join(__dirname, '/score.json'), json, async function (err) {
    if (err) throw err;
  });
}

function readScoreJson () {
  const data = fs.readFileSync(path.join(__dirname, '/score.json'));
  return (data.toString());
}

module.exports = router;
