var express = require('express');
var router = express.Router();

var fetch = require('node-fetch');

router.get('/', async function (req, res, next) {
  const text = req.query.text;
  await fetch('https://en.wiktionary.org/w/api.php?action=parse&page=' + text + '&prop=text&formatversion=2&format=json', {
    headers: {
      'Api-User-Agent': 'rapid-moose/0.0.1 (alasdair.code@hotmail.com)'
    }
  }).then(async function (response) {
    if (response.ok) {
      const json = await response.json();
      const text = await json.parse.text;
      const sections = getSubStrings(text);
      let resText = '';

      let language = 'English';
      req.query.lang === 'DE' ? language = 'German' : language = 'English';

      if ('German' in sections | 'English' in sections) {
          resText = sections[language];
      } else {
          for (const key in sections) {
            resText += sections[key];
          }
      }
      res.send(resText);
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

function getSubStrings (text) {
  let finished = false;
  let section = '';
  const sections = {};
  while (!finished) {
      text = text.substring('<h2>' + 4, text.length);
      text = text.substring(text.indexOf('id="') + 4, text.length);
      const id = text.substring(0, text.indexOf('"'));
      text = text.substring(text.indexOf('</h2>') + 5, text.length);
      if (text.indexOf('<h2>') === -1) {
          section = text.substring(0, text.indexOf('<!--'));
          sections[id] = section;
          finished = true;
      } else {
          section = text.substring(0, text.indexOf('<h2>'));
          sections[id] = section;
          text = text.substring(text.indexOf('<h2>'), text.length);
      }
  }
  return (sections);
}

module.exports = router;
