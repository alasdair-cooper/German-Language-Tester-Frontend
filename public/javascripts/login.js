/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * Contains all methods for logging in and creating new accounts.
 */
class Login {
  /**
   * Displays the form with inputs for creating a new account (signing up). Fades unwanted elements using pure JS and CSS (Utils.Timeout and the CSS classes .hide and .show). All errors are removed.
   */
  static async ShowRegisterForm () {
    const self = Login;

    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const loginFooter = document.getElementById('login-footer');
    const registerFooter = document.getElementById('register-footer');
    const modalTitle = document.getElementById('login-modal-title');
    const error = document.getElementById('sign-up-error');

    loginBox.classList.add('hide');
    loginBox.classList.remove('show');
    loginFooter.classList.add('hide');
    loginFooter.classList.remove('show');

    await Utils.Timeout(200);

    loginBox.style.display = 'none';
    loginFooter.style.display = 'none';
    registerBox.style.display = 'block';
    registerFooter.style.display = 'block';

    registerBox.classList.add('show');
    registerBox.classList.remove('hide');
    registerFooter.classList.add('show');
    registerFooter.classList.remove('hide');

    modalTitle.innerHTML = 'Register';

    error.classList.remove('alert');
    error.classList.remove('alert-danger');
    error.innerHTML = '';
  }

  /**
   * Displays the form with inputs for logging in. Fades unwanted elements using pure JS and CSS (Utils.Timeout and the CSS classes .hide and .show). All errors are removed.
   */
  static async ShowLoginForm () {
    const self = Login;

    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const loginFooter = document.getElementById('login-footer');
    const registerFooter = document.getElementById('register-footer');
    const modalTitle = document.getElementById('login-modal-title');
    const error = document.getElementById('login-error');

    registerBox.classList.add('hide');
    registerBox.classList.remove('show');
    registerFooter.classList.add('hide');
    registerFooter.classList.remove('show');

    await Utils.Timeout(200);

    registerBox.style.display = 'none';
    registerFooter.style.display = 'none';
    loginBox.style.display = 'block';
    loginFooter.style.display = 'block';

    loginBox.classList.add('show');
    loginBox.classList.remove('hide');
    loginFooter.classList.add('show');
    loginFooter.classList.remove('hide');

    modalTitle.innerHTML = 'Login';

    error.classList.remove('alert');
    error.classList.remove('alert-danger');
    error.innerHTML = '';
  }

  /**
   * Runs Login.ShowLoginForm.
   */
  static OpenLoginModal () {
    Login.ShowLoginForm();
  }

  /**
   * Runs Login.ShowRegisterForm.
   */
  static OpenRegisterModal () {
    Login.ShowRegisterForm();
  }

  /**
   * Checks the entered credentials are suitable. This allows fake emails purposefully for testing, and peer reviewers. Examples of possible emails: "@.", ".@@@", "zz@.". As long as it contains an "@" and "." it will be accepted. If it does not contain either, or the passwords do not match, an error is added ot the form. If successful, the credentials are sent to the server.
   */
  static async CheckSignUp () {
    const form = document.getElementById('sign-up-form');
    const loginModal = document.getElementById('login-modal');
    const error = document.getElementById('sign-up-error');
    if (!form.email.value.includes('@') | !form.email.value.includes('.') | form.password.value !== form.password_confirmation.value) {
      loginModal.classList.add('shake');
      error.classList.add('alert');
      error.classList.add('alert-danger');
      error.innerHTML = 'Invalid email/password combination';
      setTimeout(function () {
        loginModal.classList.remove('shake');
      }, 1000);
    } else {
      error.classList.remove('alert');
      error.classList.remove('alert-danger');
      error.innerHTML = '';

      const formData = new FormData(document.getElementById('sign-up-form'));

      const userCredentials = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      Program.ApiAccessKey = await Login.CreateUser(userCredentials);

      Login.PageSetup();
    }
  }

  /**
   * Checks the email field similarly to CheckSignUp and then sends off the credentials to the server. If the combination is invalid, the error box will be filled and shown. The access key returned if the login is successful is saved globally to Program.
   */
  static async CheckLogIn () {
    const form = document.getElementById('login-form');
    const loginModal = document.getElementById('login-modal');
    const error = document.getElementById('login-error');
    if (!form.email.value.includes('@') | !form.email.value.includes('.')) {
      loginModal.classList.add('shake');
      error.classList.add('alert');
      error.classList.add('alert-danger');
      error.innerHTML = 'Invalid email/password combination';
      setTimeout(function () {
        loginModal.classList.remove('shake');
      }, 1000);
      return (false);
    } else {
      error.classList.remove('alert');
      error.classList.remove('alert-danger');
      error.innerHTML = '';

      const formData = new FormData(document.getElementById('login-form'));

      const userCredentials = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      const accessKey = await Login.LoginUser(userCredentials);
      if (isNaN(accessKey)) {
        loginModal.classList.add('shake');
        error.classList.add('alert');
        error.classList.add('alert-danger');
        error.innerHTML = 'Invalid email/password combination';
        setTimeout(function () {
          loginModal.classList.remove('shake');
        }, 1000);
      return (false);
      } else {
        Program.ApiAccessKey = accessKey;
        Login.PageSetup();
      }
    }
  }

  /**
   * Adds a cookie to the browser so that the user can rejoin an old session if it has not expired, else they may face the session expired page. The expiry date is 3 hours in the future.
   */
  static async PageSetup () {
    Utils.HideModal('#login-modal');
    const expire = new Date(Date.now + 60 * 60 * 1000);
    document.cookie = 'ApiAccessKey=' + Program.ApiAccessKey + '; expires=' + expire.toUTCString() + '; path=/;';

    const hiddenElements = document.getElementsByClassName('post-login');
    const visibleElements = document.getElementsByClassName('pre-login');

    for (const item of hiddenElements) {
      item.hidden = false;
    }
    for (const item of visibleElements) {
      item.hidden = true;
    }

    Program.DownloadIconToImages();
    Program.DisplayChapterPage();
  }

  /**
   * The userCredentials are POSTed to the server.
   * @param {FormData} userCredentials Form data that contains a password and an email.
   */
  static async CreateUser (userCredentials) {
    const response = await fetch('/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userCredentials),
      JSON: userCredentials
    });
    return (response.text());
  }

   /**
   * The userCredentials are POSTed to the server.
   * @param {FormData} userCredentials Form data that contains a password and an email.
   */
  static async LoginUser (userCredentials) {
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userCredentials),
      JSON: userCredentials
    });
    return (response.text());
  }

   /**
   * The cookie is set to expired and the start screen displayed again (with login and sign up options) and navbar elements requiring a session key (ApiAccessKey) set to hidden.
   */
  static LogoutUser () {
    document.cookie = 'ApiAccessKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    Program.ApiAccessKey = '';
    Utils.HideModal('#settings-pop-up');

    const hiddenElements = document.getElementsByClassName('pre-login');
    const visibleElements = document.getElementsByClassName('post-login');

    for (const item of hiddenElements) {
      item.hidden = false;
    }
    for (const item of visibleElements) {
      item.hidden = true;
    }

    Program.DisplayLoginPage();
  }

  /**
   * Attempts a request to the server with the sessionKey, and if a forbidden response is given, returns false as the session has either expired or been closed early.
   * @param {int} sessionKey The ApiAccessKey for all fetches to the server. Unique to each session, and confined to a time slot of three hours from creation.
   */
  static async CheckSessionKeyValid (sessionKey) {
    const response = await fetch('http://localhost:3000/data/chapters?book=a1', { headers: { ApiAccessKey: sessionKey } });
    if (response.ok) {
      return (true);
    } else if (response.status === 403) {
      Program.DisplaySessionExpired();
    } else {
      return (false);
    }
  }

  /**
   * String manipulation for getting the ApiAccessKey from the document cookies. Returns true if the session key is found in the cookie string.
   */
  static ValidSessionCookie () {
    const sessionCookies = decodeURIComponent(document.cookie);
    if (sessionCookies.includes('ApiAccessKey=')) {
      const cookie = sessionCookies.substring((sessionCookies.indexOf('ApiAccessKey=') + 'ApiAccessKey='.length), sessionCookies.indexOf(';') === -1 ? sessionCookies.length : Math.min(sessionCookies.length, sessionCookies.indexOf(';')));
      if (Login.CheckSessionKeyValid(cookie)) {
        Program.ApiAccessKey = cookie;
        Login.PageSetup();
        return (true);
      } else {
        return (false);
      }
    } else {
      return (false);
    }
  }
}
