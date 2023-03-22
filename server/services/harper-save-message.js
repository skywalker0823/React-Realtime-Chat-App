var axios = require('axios');

function harperSaveMessage(message, room, username,createdtime) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  var data = JSON.stringify({
    operation: 'insert',
    schema: 'realtime_chat_app',
    table: 'messages',
    records: [
      {
        message,
        username,
        room,
        createdtime,
      },
    ],
  });

  var config = {
    method: 'post',
    url: dbUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': dbPw,
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => {
        resolve(JSON.stringify(response.data));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = harperSaveMessage;