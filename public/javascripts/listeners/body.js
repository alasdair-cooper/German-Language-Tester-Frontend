/* eslint-disable no-undef */
const startTestButton = document.getElementById('test-start-button');
const returnButton = document.getElementById('test-return-button');

const loginViewLogin = document.getElementById('login-view-login-button');
const loginViewSignup = document.getElementById('login-view-sign-up-button');

const apiDocsLink = document.getElementById('api-docs-link');
const docsLink = document.getElementById('docs-link');

loginViewLogin.addEventListener('click', Login.OpenLoginModal);
loginViewSignup.addEventListener('click', Login.OpenRegisterModal);

startTestButton.addEventListener('click', Program.StartTest);
returnButton.addEventListener('click', function () {
  Program.DisplayWordPage(Program.lastBook, Program.lastChapter);
  Program.UpdateWordPage();
  console.log(Program.lastBook);
  console.log(Program.lastChapter);
});

apiDocsLink.addEventListener('click', Program.DisplayDocsPage);
