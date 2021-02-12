/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class Utils {
  /**
   * Hides a modal of the given selector.
   * @param {string} selector HTML selector (id, class, tag etc.)
   */
  static HideModal (selector) {
    // JQuery as there is no neat way to do this with pure JS
    $(selector).modal('hide');
  }

   /**
   * Shows a modal of the given selector.
   * @param {string} selector HTML selector (id, class, tag etc.)
   */
  static ShowModal (selector) {
    $(selector).modal('show');
  }

  /**
   * Checks that a nested element exists in the provided JSON at JSON[keys[0]][keys[1]]..[keys[n-1]][keys[n]] where n is the length of keys. Returns true if the element exists.
   * @param {JSON} base JSON dictionary structure.
   * @param {Array} keys Array containing keys to check exist.
   */
  static KeyExists (base, keys) {
    let json = base;

    let x = 0;
    while (x < keys.length) {
      if (!(keys[x] in json)) {
        return (false);
      } else {
        json = json[keys[x]];
        x = x + 1;
      }
    }
    return (true);
  }

  /**
   * Returns an awaitable promise for the "click" event of an element.
   * @param {Element} button HTML element to wait for "click" event on.
   */
  static Click (button) {
    return new Promise(resolve => {
      button.addEventListener('click', resolve);
    });
  }

  /**
   * Returns an awaitable promise for the "transitionend" event of an element.
   * @param {Element} element HTML element to wait for "transitionend" event on.
   */
  static TransitionFinished (element) {
    return new Promise(resolve => {
      element.addEventListener('transitionend', resolve);
    });
  }

  /**
   * Returns an awaitable promise for a set period of time.
   * @param {int} ms Time in milliseconds to wait for.
   */
  static Timeout (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Randomly shuffles array using Math.random.
   * @param {Array} array An array to randomly shuffle
   */
  static ShuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return (array);
  }

  /**
   * Hides all the children of a specific element on the document.
   * @param {string} selector HTML selector of the element of whose children to hide.
   */
  static HideAll (selector) {
    const selection = document.querySelector(selector);
    for (let index = 0; index < selection.children.length; index++) {
      selection.children[index].hidden = true;
    }
  }

  /**
   * POSTs a given blob to the server if the sessionKey is valid. If the server is down then the connection lost page is displayed and if the session key is invalid, the session expired page is shown instead.
   * @param {Blob} blob Blob of image to upload.
   * @param {int} sessionKey ApiAccessKey to authorize upload to server.
   */
  static async UploadIcon (blob, sessionKey) {
    await fetch('http://localhost:3000/users/icon/upload', {
      method: 'POST',
      headers: {
        ApiAccessKey: sessionKey
      },
      body: blob
    }).then(function (response) {
      if (response.ok | response.status === 204) {
        return (response.ok);
      } else if (response.status === 403) {
        Program.DisplaySessionExpired();
        return (false);
      } else {
        Program.DisplayConnectionLost();
        return (false);
      }
    });
  }

  /**
   * GETs a given blob from the server if the sessionKey is valid. If the server is down then the connection lost page is displayed and if the session key is invalid, the session expired page is shown instead.
   * @param {*} sessionKey ApiAccessKey to authorize download from server.
   */
  static async DownloadIcon (sessionKey) {
    const response = await fetch('http://localhost:3000/users/icon/download', {
      method: 'GET',
      headers: {
        ApiAccessKey: sessionKey
      }
    });
    if (response.ok) {
      return (response.blob());
    } else if (response.status === 204) {
      return (null);
    } else if (response.status === 403) {
      Program.DisplaySessionExpired();
      return (null);
    } else {
      Program.DisplayConnectionLost();
      return (null);
    }
  }
}
