const prompt = require('prompt');
const shell = require('../shell');

const schema = {
  properties: {
    apiKey: {
      description: 'Enter your API key',
      required: true,
    },
    apiSecret: {
      description: 'Enter your API secret',
      required: true,
      hidden: true,
    },
  },
};

const login = () => {
  if (!shell.realm.isLoggedIn()) {
    prompt.start();
    prompt.get(schema, (err, result) => {
      const output = shell.realm.login(result.apiKey, result.apiSecret);
      console.log(shell.realm.whoAmI());
    });
  } else {
    const whoami = shell.execute('realm-cli whoami');
    console.log(whoami);
  }
};

module.exports = login;
