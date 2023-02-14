const { execSync } = require('child_process');

const execute = (command) => {
  const output = execSync(command);
  return output.toString().trim();
};

const realmWhoAmI = () => execute('realm-cli whoami');

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
  return execute(`realm-cli login --api-key=${apiKey} --private-api-key=${apiSecret}`);
};

const realmLogout = () => {
  if (realmIsLoggedIn()) {
    return execute('realm-cli logout');
  }

  return 'No user is currently logged in';
};

const realmPush = (localPath, appId, dryRun = true) => {
  if (!realmIsLoggedIn()) {
    throw new Error('You must be logged in to push changes to Realm');
  }
  return execute(`realm-cli push --local ${localPath}  --remote=${appId} ${dryRun ? '--dry-run' : ''}`);
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
