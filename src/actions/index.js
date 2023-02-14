const login = require('./login');
const logout = require('./logout');
const deploy = require('./deploy');
const deployDryRun = require('./deploy-dry-run');

module.exports = {
  login,
  logout,
  deploy,
  deployDryRun,
};
