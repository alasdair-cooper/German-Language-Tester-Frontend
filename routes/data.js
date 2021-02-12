/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');
var path = require('path');
var dns = require('dns');

router.get('/chapters', async function (req, res, next) {
  const book = req.query.book.toUpperCase();
  const sessionKey = req.get('ApiAccessKey');

  let data = require('./word-list.json');

  if (book === '' | book === null) {
    res.status(400);
  } else if (sessionKey === null | sessionKey === undefined) {
    res.status(403);
  }
  fetch('https://rapid-moose.azurewebsites.net/data/chapterset?book=' + book, {
    headers: {
      ApiAccessKey: sessionKey
    }
  }).then(async function (response) {
    if (response.ok) {
      json = await response.json();

      if (!(book in data)) {
        data[book] = {};
      }

      json.forEach(element => {
        if (!(element.chapter in data[book])) {
          data[book][element.chapter] = {};
        }
        data[book][element.chapter].word_count = element.word_count;
        data[book][element.chapter].words = [];
      });

      writeWordJson(JSON.stringify(data, null, 2));

      res.send(json);
    } else if (response.status === 400) {
      res.status(400);
    } else if (response.status === 403) {
      res.status(403);
    } else if (response.status >= 500 | response.status === 404) {
      const keys = Object.keys(data[book]);
      const jsonKeys = [];
      keys.forEach(element => {
        const chapter = {};
        chapter.chapter = element;
        chapter.word_count = data[book][element].word_count;
        jsonKeys.push(chapter);
      });
      res.send(jsonKeys);
    } else {
      res.status(500);
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      const keys = Object.keys(data[book]);
      const jsonKeys = [];
      keys.forEach(element => {
        const chapter = {};
        chapter.chapter = element;
        chapter.word_count = data[book][element].word_count;
        jsonKeys.push(chapter);
      });
      res.send(jsonKeys);
    }
  });
});

router.get('/words', async function (req, res, next) {
  const book = req.query.book.toUpperCase();
  const chapter = req.query.chapter;
  const sessionKey = req.get('ApiAccessKey');

  let data = require('./word-list.json');

  if (req.query.book === '' | req.query.book === null | req.query.book === undefined | req.query.chapter === null | req.query.chapter === undefined | req.query.chapter < 1) {
    res.status(400);
  } else if (sessionKey === null | sessionKey === undefined) {
    res.status(403);
  }
  const response = await fetch('https://rapid-moose.azurewebsites.net/data/wordset?book=' + book + '&chapter=' + chapter, {
    headers: {
      ApiAccessKey: sessionKey
    }
  }).then(async function (response) {
    if (response.ok) {
      json = await response.json();

      json.forEach(element => {
        const found = data[book][chapter].words.some(word => word.german_id === element.german_id);
        if (!found) {
          data[book][chapter].words.push(element);
        }
      });
      data[book][chapter].chapter_last_updated = Date.now();

      await writeWordJson(JSON.stringify(data, null, 2));

      res.send(json);
    } else if (response.status === 400) {
      res.status(400);
    } else if (response.status === 403) {
      res.status(403);
    } else if (response.status >= 500 | response.status === 404) {
      res.status(200).send(data[book][chapter].words);
    } else {
      res.status(500);
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      res.status(200).send(data[book][chapter].words);
    }
  });
});

async function writeWordJson (json) {
  fs.writeFile(path.join(__dirname, '/word-list.json'), json, async function (err) {
    if (err) throw err;
  });
}

function readWordJson () {
  let data = fs.readFileSync(path.join(__dirname, '/word-list.json'));
  return (data.toString());
}

module.exports = router;
