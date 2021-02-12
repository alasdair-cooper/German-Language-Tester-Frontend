/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
class Scores {
  static async FetchUserScoreJson (sessionKey) {
    let json = '';
    await fetch('http://localhost:3000/users/score/download', {
      method: 'GET',
      headers: {
        ApiAccessKey: sessionKey
      }
    }).then(async function (response) {
      if (response.ok) {
        json = await response.json();
        return (json);
      } else if (response.status === 403) {
        Program.DisplaySessionExpired();
      } else {
        Program.DisplayConnectionLost();
      }
    }).catch((err) => {
      Program.DisplayConnectionLost();
    });
    return (json);
  }

  static async SetUserScoreJson (sessionKey, json) {
    await fetch('http://localhost:3000/users/score/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiAccessKey: sessionKey
      },
      body: JSON.stringify(json)
    }).then(async function (response) {
      if (response.ok) {
        return (response.ok);
      } else if (response.status === 403) {
        Program.DisplaySessionExpired();
      } else {
        Program.DisplayConnectionLost();
      }
    }).catch((err) => {
      Program.DisplayConnectionLost();
    });
  }
}
