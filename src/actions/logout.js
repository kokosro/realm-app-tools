const shell = require('../shell');

const logout = () => {
  const output = shell.realm.logout();
  console.log(output);
};

module.exports = logout;
