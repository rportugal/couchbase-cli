#! /usr/bin/env node
const { Couchbase } = require('couchbase-js');
const fs = require('fs');
const inquirer = require('inquirer');
const os = require('os');
const path = require('path');
const program = require('commander');

program.version(process.env.npm_package_version);

const configPath = path.join(os.homedir(), '.couchbase-cli.json');

const loadConfig = () => {
  const rawData = fs.readFileSync(configPath);
  return JSON.parse(rawData);
};

const saveConfig = config => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

const bucket = () => {
  const config = loadConfig();
  const currentConfig = config.configs[config.current];
  const { url, username, password, insecure } = currentConfig;
  const conn = new Couchbase(url, username, password, { insecure });
  return conn.openBucket('digital');
};

program
  .command('switch')
  .description('switch to another config')
  .action(function() {
    const config = loadConfig();
    const choices = config.configs.map((conf, idx) => ({ key: idx.toString(), name: conf.name, value: idx }));
    return inquirer
      .prompt([
        {
          type: 'list',
          message: 'Select config: ',
          name: 'switch',
          choices
        }
      ])
      .then(answers => {
        config.current = answers.switch;
        saveConfig(config);
      });
  });
program
  .command('get <documentId>')
  .description('get a document')
  .action(async function(documentId) {
    try {
      const data = await bucket().get(documentId);
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('query <n1ql>')
  .description('run a N1QL query')
  .action(async function(n1ql) {
    try {
      const data = await bucket().query(n1ql);
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('remove <docId> [otherDocIds...]')
  .description('remove documents')
  .action(function(docId, otherDocIds) {
    if (otherDocIds) {
      // ...
    }
  });
program.parse(process.argv);
