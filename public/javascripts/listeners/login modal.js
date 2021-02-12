/* eslint-disable no-undef */
const loginModalLogin = document.getElementById('login-modal-login-button');
const loginModalSignup = document.getElementById('login-modal-sign-up-button');

const loginConfirm = document.getElementById('login-confirm');
const signUpConfirm = document.getElementById('sign-up-confirm');

loginModalLogin.addEventListener('click', Login.ShowLoginForm);
loginModalSignup.addEventListener('click', Login.ShowRegisterForm);

loginConfirm.addEventListener('click', Login.CheckLogIn);
signUpConfirm.addEventListener('click', Login.CheckSignUp);
