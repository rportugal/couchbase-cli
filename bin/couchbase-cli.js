#! /usr/bin/env node
const program = require('commander');
const rp = require('request-promise');

program.version('0.1.0');

program
  .command('get <documentId>')
  .description('get a document')
  .action(function(req) {
    console.log('get ');
    rp('http://www.google.com')
      .then(res => console.log(res))
      .catch(err => console.error(err));
  });

program
  .command('query <n1ql>')
  .description('run a N1QL query')
  .action(function(n1ql) {
    console.log(`query ${n1ql}`);
    rp('http://www.google.com')
      .then(res => console.log(res))
      .catch(err => console.error(err));
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

// load config
