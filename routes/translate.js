/* eslint-disable no-undef */
var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

router.get('/', async function (req, res, next) {
  await fetch('https://rapid-moose.azurewebsites.net/translate?text=' + encodeURI(req.query.text) + '&from=' + encodeURI(req.query.from) + '&to=' + encodeURI(req.query.to), {
    headers: {
      ApiAccessKey: req.get('ApiAccessKey')
    }
  }).then(async function (response) {
    if (response.ok) {
      json = await response.json();
      res.send(json);
    } else if (response.status === 403) {
      res.status(403);
    } else {
      if (req.query.to === 'de' & req.query.from === 'en') {
        const englishToGermanDict = require('./english_german.json');
        if (req.query.text in englishToGermanDict) {
          res.send('{"de": "' + englishToGermanDict[req.query.text] + '"}');
        }
      } else if (req.query.to === 'en' & req.query.from === 'de') {
        const germanToEnglishDict = require('./german_english.json');
        if (req.query.text in germanToEnglishDict) {
          res.send('{"en": "' + germanToEnglishDict[req.query.text] + '"}');
        }
      }
    }
  }).catch((error) => {
    if (error.errno === 'ENOTFOUND') {
      if (req.query.to === 'de' & req.query.from === 'en') {
        const englishToGermanDict = require('./english_german.json');
        if (req.query.text in englishToGermanDict) {
          res.send('{"de": "' + englishToGermanDict[req.query.text] + '"}');
        }
      } else if (req.query.to === 'en' & req.query.from === 'de') {
        const germanToEnglishDict = require('./german_english.json');
        if (req.query.text in germanToEnglishDict) {
          res.send('{"en": "' + germanToEnglishDict[req.query.text] + '"}');
        }
      }
    }
  });
});

module.exports = router;
