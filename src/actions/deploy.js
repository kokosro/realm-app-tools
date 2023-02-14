const prompt = require('prompt');
const shell = require('../shell');
const realmDeploy = require('../realm-deploy');

const schema = {
  properties: {
    path: {
      description: 'Path to the project',
      required: true,
    },
    appId: {
      description: 'App ID',
      required: true,
    },
    environment: {
      description: 'Environment',
      required: true,
    },
  },
};

const deploy = () => {
  if (!shell.realm.isLoggedIn()) {
    console.log('You must be logged in to deploy');
    return;
  }
  prompt.start();
  prompt.get(schema, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    realmDeploy(result.path, result.appId, result.environment, false)
      .then(() => {
        console.log('Deployed');
      }).catch((error) => {
        console.log(error);
      });
  });
};

module.exports = deploy;
