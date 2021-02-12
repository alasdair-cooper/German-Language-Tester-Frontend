/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const changeModeSelect = document.getElementById('navbar-mode-select');
const goButton = document.getElementById('navbar-go-button');
const dashboardButton = document.getElementById('dashboard-button');
const icon = document.getElementById('icon');
const loginButton = document.getElementById('navbar-login-button');
const uploadButton = document.getElementById('settings-upload-button');
const logoutButton = document.getElementById('settings-logout-button');
const adminKeyButton = document.getElementById('admin-submit-button');

changeModeSelect.addEventListener('change', Program.ChangeMode);
goButton.addEventListener('click', Program.NavbarGo);
dashboardButton.addEventListener('click', Program.DisplayChapterPage);
loginButton.addEventListener('click', Login.OpenLoginModal);
icon.addEventListener('click', Program.DisplayChapterPage);
logoutButton.addEventListener('click', Login.LogoutUser);
uploadButton.addEventListener('click', function () {
  console.log('something');
  Program.UploadIconAsBlob();
});
adminKeyButton.addEventListener('click', Program.DisplayAdminPage);
