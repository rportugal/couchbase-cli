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

const openBucket = name => {
  const config = loadConfig();
  const currentConfig = config.configs[config.current];
  const { url, username, password, insecure } = currentConfig;
  const conn = new Couchbase(url, username, password, { insecure });
  return conn.openBucket(name);
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
  .command('get <bucket> <documentId>')
  .description('get a document')
  .action(async function(bucket, documentId) {
    try {
      const data = await openBucket(bucket).get(documentId);
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('query <bucket> <n1ql>')
  .description('run a N1QL query')
  .action(async function(bucket, n1ql) {
    try {
      const data = await openBucket(bucket).query(n1ql);
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('remove <bucket> <docId> [otherDocIds...]')
  .description('remove documents')
  .action(function(bucket, docId, otherDocIds) {
    if (otherDocIds) {
      // ...
    }
  });

program
  .command('list <bucket> <skip> <limit>')
  .description('lists documents in bucket')
  .action(async function(bucket, skip, limit) {
    try {
      const data = await openBucket(bucket).list(skip, limit);
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program.parse(process.argv);
