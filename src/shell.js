const { execSync } = require('child_process');
const path = require('path');

const realmCliPath = path.join(__dirname, '..', 'node_modules', 'mongodb-realm-cli', 'realm-cli');

const execute = (command) => {
  const output = execSync(command);
  return output.toString().trim();
};

const realmWhoAmI = () => execute(`${realmCliPath} whoami`);

const realmIsLoggedIn = () => {
  try {
    return !realmWhoAmI().toLowerCase().includes('no user is currently logged in');
  } catch (e) {
    return false;
  }
};

const realmLogin = (apiKey, apiSecret) => {
  if (realmIsLoggedIn()) {
    return realmWhoAmI();
  }
  return execute(`${realmCliPath} login --api-key=${apiKey} --private-api-key=${apiSecret}`);
};

const realmLogout = () => {
  if (realmIsLoggedIn()) {
    return execute(`${realmCliPath} logout`);
  }

  return 'No user is currently logged in';
};

const realmPush = (localPath, appId, dryRun = true) => {
  if (!realmIsLoggedIn()) {
    throw new Error('You must be logged in to push changes to Realm');
  }
  return execute(`${realmCliPath} push --local ${localPath}  --remote=${appId} ${dryRun ? '--dry-run' : ''}`);
};

module.exports = {
  execute,
  realm: {
    isLoggedIn: realmIsLoggedIn,
    whoAmI: realmWhoAmI,
    login: realmLogin,
    logout: realmLogout,
    push: realmPush,
  },
};
