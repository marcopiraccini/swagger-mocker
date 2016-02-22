#!/usr/bin/env node

var yeoman = require('yeoman-environment');
var minimist = require('minimist');
var program = require('commist')();
var path = require('path');
var validateSwagger = require('./lib/validate');

function argify(args) {
  return minimist(args, {
    alias: {
      p: ['port'],
      s: ['swagger'],
      n: ['name'],
      t: ['target']
    },
    defaults: {
      p: 10010,
      n: 'mock',
      t: 'test'
    }
  });
}

var showHelp = function() {
  console.log('');
  console.log('usage: swagger-creator <command> <options>');
  console.log('available options:');
  console.log('generate - generate a mock. port (-p), swagger path (-s), name (-n) and target dir (-t) can be specified');
  console.log('validate - validate a swagger, (-s) can be specified');
  console.log('help - show this help');
};

var generate = function(args) {
  args = argify(args);
  var swaggerRelativePath = args.swagger ? args.swagger: './swagger.yml'
  var swaggerAbsPath = path.resolve(swaggerRelativePath);
  var opts = {
    port: args.port ? args.port: 10010,
    swaggerPath: swaggerAbsPath,
    appName: args.name ? args.name: 'mock',
    targetDir: args.target ? args.target: 'test'
  }
  env.run('npm:app', opts, function(err) {
    if (err) {
      return console.log("ERROR IN GENERATING", err)
    }
    console.log("Service correctly generated")
  });
}

var validate = function(args) {
  args = argify(args);
  var swaggerAbsPath = path.resolve( args.swagger);
  validateSwagger(swaggerAbsPath, function (err, results) {
    if (err) {
      return console.log("ERROR in executing validation: ", err);
    }
    console.log(results);
  })
}

program.register('generate', generate);
program.register('validate', validate);
program.register('help', showHelp);
program.register('--help', showHelp);

var env = yeoman.createEnv();
env.register(__dirname + '/app', 'npm:app');

function start(argv) {
  var remaining = program.parse(argv);
  if (remaining) { console.log('No matching command.'); }
}

module.exports = start;
if (require.main === module) {
  start(process.argv.slice(2));
}
