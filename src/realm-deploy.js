const fs = require('fs');
const shell = require('./shell');
const question = require('./question');

const checkFunctionsForEnvs = (envs = {}) => {
  const functionFiles = fs.readdirSync('./functions');
  let ok = true;
  for (const functionFile of functionFiles) {
    if (functionFile.endsWith('.js')) {
      const functionFileContent = fs.readFileSync(`./functions/${functionFile}`, 'utf8');
      console.log(`Checking ${functionFile} for envs...`);

      const existingEnvsInFunctionContent = functionFileContent.match(/.*context\.environment\.values\.([a-zA-Z0-9_]*)/ig);
      const vars = [];
      const missing = [];
      if (existingEnvsInFunctionContent) {
        for (const match of existingEnvsInFunctionContent) {
          const varName = match.match(/context\.environment\.values\.([a-zA-Z0-9_]*)/i)[1];
          vars.push(varName);
          if (!envs[varName]) {
            console.log(
              `  ${varName} is not defined as environment variable and is used in ./functions/${functionFile}`,
            );
            ok = false;
            missing.push(varName);
          }
        }
      }
      if (missing.length > 0) {
        console.log(
          `  Missing environment variables [${missing.join(', ')}] in ./functions/${functionFile}`,
        );
      } else if (vars.length > 0) {
        console.log(`  All environment variables [${vars.join(', ')}] are defined in ./functions/${functionFile}`);
      } else {
        console.log(`  No environment variables are used in ./functions/${functionFile}`);
      }
    }
  }
  return ok;
};

const realmDeploy = async (projectPath, appId, environment, dryRun = true) => {
  if (!fs.existsSync(projectPath)) {
    throw new Error(`Project path ${projectPath} does not exist`);
  }
  process.chdir(projectPath);
  if (!fs.existsSync('realm_config.json')) {
    throw new Error(`Project path ${projectPath} does not contain a realm_config.json file`);
  }
  const preDeploymentConfig = JSON.parse(fs.readFileSync('realm_config.json'));
  const deploymentConfig = {
    ...preDeploymentConfig,
    app_id: appId,
    environment,
  };

  const envVarFileExists = fs.existsSync(`./environments/${environment}.json`);
  if (!envVarFileExists) {
    throw new Error(`Environment file ${projectPath}/environments/${environment}.json does not exist`);
  }

  const envVars = JSON.parse(fs.readFileSync(`./environments/${environment}.json`));
  if (checkFunctionsForEnvs(envVars.values || {})) {
    console.log('All environment variables are defined. OK.');
  } else {
    console.log('Some environment variables are missing. Please fix and try again.');
    process.exit(1);
  }
  console.log('Writing realm_config.json...');
  fs.writeFileSync('realm_config.json', JSON.stringify(deploymentConfig, null, 2));
  console.log('Pushing changes to Realm...');
  const output = shell.realm.push(projectPath, appId, dryRun);
  console.log(output);
  console.log('Reverting realm_config.json...');
  fs.writeFileSync('realm_config.json', JSON.stringify(preDeploymentConfig, null, 2));
};

module.exports = realmDeploy;
