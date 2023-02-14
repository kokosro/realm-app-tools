#! /usr/bin/env node

const { program } = require('commander');
const actions = require('../src/actions');


program
  .command('login')
  .description('Login to your realm account')
  .action(actions.login);


program
  .command('logout')
  .description('Logout from your realm account')
  .action(actions.logout);
  

program
  .command('deploy')
  .description('Deploy your app to realm')
  .action(actions.deploy);

program
  .command('deploy-dry-run')
  .description('Deploy your app to realm')
  .action(actions.deployDryRun);

program.parse();
