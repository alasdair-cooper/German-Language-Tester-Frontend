/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * The controller for all main activities related to the general run of the program, post login.
 */
class Program {
  /**
   * Entry point to launch program. Initialises global properties of Program "wordSetJson" and "ApiAccessKey".
   */
  static async Main () {
    Program.wordSetJson = [];
    Program.ApiAccessKey = '';
    Program.ChangeMode();
    Program.DisplayLoginPage();
  }

  /**
   * Displays API docs (Swagger)
   */
  static async DisplayDocsPage () {
    const self = Program;

    document.getElementById('footer').style.position = 'fixed';

    Utils.HideAll('#main-body-content');
    const view = document.getElementById('swagger-ui');
    view.hidden = false;
  }

  /**
   * Displays the HTML div containing the elements for displaying the sections of words from a specific book/chapter.
   * @param {string} book The book of the chapter to display.
   * @param {number} chapter The chapter to display.
   */
  static async DisplayWordPage (book, chapter) {
    const self = Program;
    self.currentPage = 'word';
    self.currentBook = book;
    self.currentChapter = chapter;

    document.getElementById('footer').style.position = 'fixed';

    self.scoreJson = await Scores.FetchUserScoreJson(Program.ApiAccessKey);
    Utils.HideAll('#main-body-content');
    const view = document.getElementById('word-view');
    view.hidden = false;

    const tbody = document.getElementById('word-table-body');
    tbody.innerHTML = '';

    let json = [];

    document.body.style.cursor = 'progress';

    if (!((chapter) in self.wordSetJson[book])) {
      self.wordSetJson[book][chapter] = [];
      const fetched = await fetch('http://localhost:3000/data/words?book=' + book + '&chapter=' + chapter, {
        headers: {
          ApiAccessKey: Program.ApiAccessKey
        }
      }).then(async function (response) {
        if (response.ok) {
          json = await response.json();
          json.forEach(element => {
            const sectionName = element.german_section.trim();
            if (!(sectionName in self.wordSetJson[book][chapter])) {
              self.wordSetJson[book][chapter][sectionName] = [];
            }
            self.wordSetJson[book][chapter][sectionName].push(element);
          });
          json = self.wordSetJson[book][chapter];
          return (true);
        } else if (usersResponse.status === 403) {
          Program.DisplaySessionExpired();
          return (false);
        } else {
          Program.DisplayConnectionLost();
          return (false);
        }
      }).catch((err) => {
        Program.DisplayConnectionLost();
        return (false);
      });

      if (fetched) {
        console.log(self.wordSetJson);
        self.UpdateWordPage(book, chapter);
      }
      document.body.style.cursor = 'default';
    }
  }

  /**
   * Updates the table containing the words from DisplayWordPage. Runs every second and recalculates the current retention value for each word every time.
   */
  static async UpdateWordPage () {
    const self = Program;
    const book = self.currentBook;
    const chapter = self.currentChapter;
    const tbody = document.getElementById('word-table-body');
    tbody.innerHTML = '';
    for (const sectionKey in self.wordSetJson[book][chapter]) {
      const template = document.getElementById('template-header');
      const clone = template.content.cloneNode(true);
      const th = clone.querySelectorAll('th');

      th[0].textContent = sectionKey;

      tbody.appendChild(clone);

      tbody.children[tbody.children.length - 1].addEventListener('click', function () {
        self.DisplayTestPage(self.wordSetJson[book][chapter][sectionKey]);
      });

      self.wordSetJson[book][chapter][sectionKey].forEach(element => {
        const template = document.getElementById('template-row');
        const clone = template.content.cloneNode(true);
        const td = clone.querySelectorAll('td');
        const tr = clone.querySelectorAll('tr');

        td[0].textContent = element.german_english;
        td[1].textContent = element.german_translation;
        if (Utils.KeyExists(self.scoreJson.retention, [book, chapter, element.german_section]) & element.german_id in self.scoreJson.scores) {
          const t = (Date.now() - self.scoreJson.retention[book][chapter][element.german_section].last_tested) / (1000 * 60 * 60 * 24);
          const Rzero = self.scoreJson.retention[book][chapter][element.german_section].last_retention;
          const R = Rzero * Math.pow(Math.E, -(Math.LN2 / 3) * t);
          td[2].textContent = Math.min(R + self.scoreJson.retention[book][chapter][element.german_section].retention_factor, 100).toFixed(3);
          switch (self.scoreJson.scores[element.german_id].colour) {
            case 1:
              tr[0].style.backgroundColor = '#90EE90';
              break;
            case 0:
              tr[0].style.backgroundColor = '#FF8C00';
              break;
            case -1:
              tr[0].style.backgroundColor = '#E77471';
              break;
            default:
              break;
          }
        } else {
          td[2].textContent = 'Untested';
        }

        tbody.appendChild(clone);
      });
    }
    if (Program.currentPage === 'word') {
      setTimeout(Program.UpdateWordPage, 1000);
    }
  }

  /**
   * Displays the chapter view which contains a table where each row contains the chapter number and the number of words within the chapter. Clicking on a row in the table will cause the relevant chapters words to be displayed.
   */
  static async DisplayChapterPage () {
    const self = Program;
    self.currentPage = 'chapter';

    document.getElementById('footer').style.position = 'absolute';

    Utils.HideAll('#main-body-content');
    const view = document.getElementById('chapter-view');
    view.hidden = false;

    const tbody = document.getElementById('chapter-table-body');
    tbody.innerHTML = '';

    const book = 'A1';
    self.lastBook = book;
    self.wordSetJson[book] = [];

    document.body.style.cursor = 'progress';

    let fetched = true;

    let json = self.chapterJson;
    if (json == null) {
      fetched = await fetch('http://localhost:3000/data/chapters?book=' + book, {
        headers: {
          ApiAccessKey: self.ApiAccessKey
        }
      }).then(async function (response) {
        if (response.ok) {
          json = await response.json();
          self.chapterJson = json;
          return (true);
        } else if (usersResponse.status === 403) {
          Program.DisplaySessionExpired();
          return (false);
        } else {
          Program.DisplayConnectionLost();
          return (false);
        }
      }).catch((err) => {
        Program.DisplayConnectionLost();
        return (false);
      });
    }

    if (fetched) {
      json.forEach(element => {
        const template = document.getElementById('template-row');
        const clone = template.content.cloneNode(true);
        const td = clone.querySelectorAll('td');

        td[0].textContent = 'Chapter ' + element.chapter;
        td[1].textContent = element.word_count + ' words';

        tbody.appendChild(clone);

        tbody.children[tbody.children.length - 1].addEventListener('click', function () {
          self.lastChapter = element.chapter;
          self.DisplayWordPage(book, element.chapter);
        });
      });
    }
    document.body.style.cursor = 'default';
  }

  /**
   * Displays the login page if no valid cookie can be fetched from the browser.
   */
  static DisplayLoginPage () {
    if (Login.ValidSessionCookie()) {
      //
    } else {
      const self = Program;
      self.currentPage = 'login';

      document.getElementById('footer').style.position = 'absolute';

      Utils.HideAll('#main-body-content');
      const view = document.getElementById('login-view');
      view.hidden = false;
    }
  }

  /**
   * Displays the introduction page for a test on a certain section of words.
   * @param {Array} words The set of words to be tested.
   */
  static DisplayTestPage (words) {
    const self = Program;
    self.currentPage = 'test';

    document.getElementById('footer').style.position = 'absolute';

    Utils.HideAll('#main-body-content');
    const view = document.getElementById('test-start-view');
    view.hidden = false;

    self.testWords = words;
  }

  /**
   * Displays the admin page when the entered adminKey is correct, as well as the ApiAccessKey from Program.s
   */
  static async DisplayAdminPage () {
    const adminKey = document.getElementById('admin-key-input').value;
    const usersResponse = await fetch('http://localhost:3000/admin/users', {
      method: 'GET',
      headers: {
        ApiAccessKey: Program.ApiAccessKey,
        ApiAdminKey: adminKey
      }
    }).catch((err) => {
      Program.DisplayConnectionLost();
    });
    if (usersResponse.ok) {
      const sessionsResponse = await fetch('http://localhost:3000/admin/sessions', {
        method: 'GET',
        headers: {
          ApiAccessKey: Program.ApiAccessKey,
          ApiAdminKey: adminKey
        }
      });
      const sessionsJson = await sessionsResponse.json();
      const usersJson = await usersResponse.json();

      Program.UpdateAdminPage(sessionsJson, usersJson);

      document.getElementById('pre-admin').hidden = true;
      document.getElementById('post-admin').hidden = false;
    } else if (usersResponse.status === 403) {
      Program.DisplaySessionExpired();
    } else if (sessionsResponse.status === 503) {
      Program.NoInternet();
    }
  }

  /**
   * Updates the admin section of the settings modal with tables containing all users and sessions.
   * @param {JSON} sessions The JSON containing the sessions in array format.
   * @param {JSON} users The JSON containing the users in array format.
   */
  static async UpdateAdminPage (sessions, users) {
    const sessionTBody = document.getElementById('session-table-body');
    sessionTBody.innerHTML = '';

    sessions.forEach(element => {
      const template = document.getElementById('session-template-row');
      const clone = template.content.cloneNode(true);
      const td = clone.querySelectorAll('td');

      td[0].textContent = element.session_id;
      const start = new Date(Date.parse(element.session_start));
      td[1].textContent = start.toLocaleString();
      const end = new Date(Date.parse(element.session_end));
      td[2].textContent = end.toLocaleString();
      td[3].textContent = element.session_expired;
      td[4].textContent = element.session_user_id;

      sessionTBody.appendChild(clone);
    });

    const userTBody = document.getElementById('user-table-body');
    userTBody.innerHTML = '';

    users.forEach(element => {
      const template = document.getElementById('user-template-row');
      const clone = template.content.cloneNode(true);
      const td = clone.querySelectorAll('td');

      td[0].textContent = element.user_id;
      td[1].textContent = element.user_email;
      td[2].textContent = new Date(element.user_time_created).toLocaleString();

      userTBody.appendChild(clone);
    });
  }

  /**
   * Displays a page warning the user that the connection to the Node server was lost.
   */
  static async DisplayConnectionLost () {
    const self = Program;
    self.currentPage = 'no-connection';

    console.log('Disconnected from Node server.');

    document.getElementById('footer').style.position = 'absolute';

    Utils.HideAll('#main-body-content');
    const view = document.getElementById('no-connection-view');
    view.hidden = false;
  }

  /**
   * Displays an error bar telling the user that there is no internet connection.
   */
  static async NoInternet () {
    document.getElementById('conn-error').innerHTML = 'You have lost connection to the internet. Some features may be unavailable';
    document.getElementById('conn-error').hidden = false;
  }

  /**
   * Displays a page warning the user that the session expired.
   */
  static async DisplaySessionExpired () {
    Login.LogoutUser();
    const self = Program;
    self.currentPage = 'session-expired';

    document.getElementById('footer').style.position = 'absolute';

    Utils.HideAll('#main-body-content');
    const view = document.getElementById('session-expired-view');
    view.hidden = false;
  }

  /**
   * Translates the text into the language specified in the "navbar-language-select-02". If there is no response or the session has expired the appropriate page is displayed.
   * @param {string} text The text to be translated.
   */
  static async Translate (text) {
    let outputTextArea = document.getElementById('navbar-input-02-input');

    const languages = ['en', 'de'];
    const from = languages[document.getElementById('navbar-language-select-01').value - 1];
    const to = languages[document.getElementById('navbar-language-select-02').value - 1];

    document.body.style.cursor = 'progress';

    if (text !== '') {
      const response = await fetch('http://localhost:3000/translate?text=' + encodeURI(text) + '&to=' + encodeURI(to) + '&from=' + encodeURI(from), { headers: { ApiAccessKey: Program.ApiAccessKey } });
      if (response.ok) {
        // body = body.substring(1, body.length - 1);
        const json = await response.json();
        const translation = await json[to];
        outputTextArea.setAttribute('value', translation);
      } else if (response.status === 403) {
       Program.DisplaySessionExpired();
      } else {
        Program.DisplayConnectionLost();
      }
    } else {
      outputTextArea = '';
    }

    document.body.style.cursor = 'default';
  }

  /**
   * Defines the text in the language specified in the "navbar-language-select-01". If there is no response or the session has expired the appropriate page is displayed.
   * @param {string} text The text to be defined.
   */
  static async Define (text) {
    const languageSelectValue = document.getElementById('navbar-language-select-01').value;
    const outputAreaTitle = document.getElementById('modal-title-text');
    const outputAreaBody = document.getElementById('modal-body-text');

    let language = '';
    languageSelectValue === '1' ? language = 'EN' : language = 'DE';

    document.body.style.cursor = 'progress';
    await fetch('http://localhost:3000/define?text=' + text.replace(' ', '_') + '&lang=' + language).then(async function (response) {
      console.log(response);
      if (response.ok) {
        const body = await response.text();

        if (body !== 'null' & body !== '') {
          outputAreaBody.innerHTML = body;
        } else {
          outputAreaTitle.innerHTML = 'No results.';
          outputAreaBody.innerHTML = 'No section of language ' + language + '.';
        }

        outputAreaTitle.innerHTML = text.replace('_', ' ');

        const anchors = outputAreaBody.querySelectorAll('a:not(.image)');
        anchors.forEach(anchor => {
          anchor.setAttribute('href', '#');
          if (anchor.hasAttribute('title')) {
            const title = anchor.getAttribute('title');
            if (!(title === null | title.includes(':'))) {
              anchor.setAttribute('onclick', 'Program.Define("' + title.replace(' ', '_') + '")');
            } else {
              anchor.style.color = 'black';
              anchor.setAttribute('style', 'color: black; pointer-events: none');
            }
          }
        });
        const editSpans = outputAreaBody.querySelectorAll('.mw-editsection');
        editSpans.forEach(span => {
          const parent = span.parentElement;
          parent.removeChild(span);
        });
        Utils.ShowModal('#definition-pop-up');
        document.body.style.cursor = 'default';
      } else if (response.status === 403) {
        Program.DisplaySessionExpired();
      } else if (response.status === 503) {
        Program.NoInternet();
      } else {
        Program.DisplayConnectionLost();
      }
    }).catch((err) => {
      Program.DisplayConnectionLost();
    });
  }

  /**
   * Contains the test process that displays a question, waits for a user response, warns them if they are close (missing capital letter), and then tells them the correct answer. It continues until they have either got each question (C=correct, W=wrong): C, WCC, WW, WCWC-in this case it continues until they break the cycle by getting either a question right or wrong twice in a row. The score is added to the score JSON and then uploaded to the server.
   */
  static async StartTest () {
    const self = Program;

    Utils.HideAll('#main-body-content');
    const view = document.getElementById('test-view');
    view.hidden = false;

    document.getElementById('test-return-button').hidden = true;

    const shuffledWords = JSON.parse(JSON.stringify(Utils.ShuffleArray(self.testWords)));

    const book = shuffledWords[0].german_book.trim();
    const chapter = shuffledWords[0].german_chapter;
    const section = shuffledWords[0].german_section.trim();

    const questionBox = document.getElementById('test-question');
    const answerBox = document.getElementById('test-answer');
    const errorBox = document.getElementById('test-error');
    const confirmButton = document.getElementById('test-confirm-button');

    confirmButton.removeEventListener('click', self.StartTest);
    answerBox.disabled = false;

    while (shuffledWords.length > 0) {
      const currentWord = shuffledWords.pop();
      const currentEnglish = currentWord.german_english.trim();
      const currentGerman = currentWord.german_translation.trim();
      const currentId = currentWord.german_id;

      if (!(currentWord.german_id in self.scoreJson.scores)) {
        self.scoreJson.scores[currentId] = {};
        self.scoreJson.scores[currentId].colour = 0;
        self.scoreJson.scores[currentId].attempts = 0;
      }

      confirmButton.innerHTML = 'Submit';
      let correct = false;
      questionBox.innerHTML = 'What is ' + currentEnglish + ' in German?';

      await Utils.Click(confirmButton);

      if (answerBox.value.trim() !== currentGerman &
      answerBox.value.trim().toLowerCase() === currentGerman.toLowerCase() & ['der', 'die', 'das'].includes(currentGerman.substring(0, 3))) {
        errorBox.classList.add('alert');
        errorBox.classList.add('alert-danger');
        errorBox.innerHTML = 'Maybe you\'re missing a capital letter?';
        await Utils.Click(confirmButton);
      }

      if (answerBox.value.trim() === currentGerman) {
        correct = true;
        if (self.scoreJson.scores[currentId].colour < 1) {
          self.scoreJson.scores[currentId].colour += 1;
        }
      } else {
        correct = false;
        if (self.scoreJson.scores[currentId].colour > -1) {
          self.scoreJson.scores[currentId].colour -= 1;
        }
        self.scoreJson.scores[currentId].attempts += 1;
      }

      if (self.scoreJson.scores[currentId].attempts === 1 & self.scoreJson.scores[currentId].colour < 1) {
        shuffledWords.unshift(currentWord);
      }

      errorBox.classList.remove('alert');
      errorBox.classList.remove('alert-danger');
      errorBox.innerHTML = '';

      confirmButton.innerHTML = 'Next';
      answerBox.disabled = true;

      errorBox.classList.add('alert');
      errorBox.innerHTML = 'You were ' + (correct ? 'correct' : 'incorrect. The correct answer is ' + currentGerman) + '.';
      correct ? errorBox.classList.add('alert-success') : errorBox.classList.add('alert-danger');

      await Utils.Click(confirmButton);

      errorBox.classList.remove('alert');
      errorBox.classList.remove('alert-danger');
      errorBox.innerHTML = '';

      answerBox.value = '';
      answerBox.disabled = false;
    }
    answerBox.disabled = true;

    for (const key in self.scoreJson.scores) {
      self.scoreJson.scores[key].attempts = 0;
    }

    if (!(book in self.scoreJson.retention)) {
      self.scoreJson.retention[book] = {};
    }
    if (!(chapter in self.scoreJson.retention[book])) {
      self.scoreJson.retention[book][chapter] = {};
    }
    if (!(section in self.scoreJson.retention[book][chapter])) {
      self.scoreJson.retention[book][chapter][section] = {};
      self.scoreJson.retention[book][chapter][section].last_tested = Date.now();
      self.scoreJson.retention[book][chapter][section].last_retention = 100;
      self.scoreJson.retention[book][chapter][section].retention_factor = 0;
    } else if (section in self.scoreJson.retention[book][chapter]) {
      const t = Math.floor((Date.now() - self.scoreJson.retention[book][chapter][section].last_tested) / (1000 * 60 * 60 * 24));
      const Rzero = self.scoreJson.retention[book][chapter][section].last_retention;
      const R = Rzero * Math.pow(Math.E, -(Math.LN2 / 3) * t);

      self.scoreJson.retention[book][chapter][section].retention_factor += 100 - R;
      self.scoreJson.retention[book][chapter][section].last_tested = Date.now();
      self.scoreJson.retention[book][chapter][section].last_retention = R;
    }

    Scores.SetUserScoreJson(Program.ApiAccessKey, self.scoreJson);

    confirmButton.innerHTML = 'Test again';
    document.getElementById('test-return-button').hidden = false;
    confirmButton.addEventListener('click', self.StartTest);
  }

  /**
   * Toggles the mode between define and translate based on the value of the dropdown "navbar-mode-select".
   */
  static ChangeMode () {
    const modeSelect = document.getElementById('navbar-mode-select');
    const currentMode = modeSelect.value;

    const navbarInput2 = document.getElementById('navbar-input-02');

    if (currentMode === '2') { // translate change to define
      navbarInput2.hidden = true;
    } else if (currentMode === '1') { // define change to translate
      navbarInput2.hidden = false;
    }
  }

  /**
   * Triggers Define or Translate based on the value of the dropdown "navbar-mode-select".
   */
  static NavbarGo () {
    const modeSelect = document.getElementById('navbar-mode-select');
    const currentMode = modeSelect.value;

    const input01 = document.getElementById('navbar-input-01-input').value;

    if (currentMode === '2') { // define
      Program.Define(input01);
    } else if (currentMode === '1') { // translate
      Program.Translate(input01);
    }
  }

  /**
   * Uploads the image from the file input in the settings modal, if there is one. It then runs the method to download the icon.
   */
  static async UploadIconAsBlob () {
    const fileInput = document.getElementById('settings-user-icon-input');
    if (fileInput.files.length > 0) {
      await Utils.UploadIcon(fileInput.files[0], Program.ApiAccessKey);
    }
    Program.DownloadIconToImages();
  }

  /**
   * Downloads the image from the server and places it in the icon frame at a temporary URL that lasts as long as the document is active.
   */
  static async DownloadIconToImages () {
    const blob = await Utils.DownloadIcon(Program.ApiAccessKey);
    if (blob != null) {
      const src = window.webkitURL.createObjectURL(blob);
      const iconFrame = document.getElementById('account-icon');
      iconFrame.style.backgroundImage = 'url("' + src + '")';
    }
  }
}
