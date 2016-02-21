#!/usr/bin/env node

var yeoman = require('yeoman-environment');
var minimist = require('minimist');
var program = require('commist')();
var path = require('path');
var env = yeoman.createEnv();
env.register('./app', 'npm:app');

function argify(args) {
  return minimist(args, {
    alias: {
      p: ['port'],
      s: ['swagger'],
      n: ['name']
    },
    defaults: {
      p: 10010,
      n: 'mock'
    }
  });
}

var showHelp = function() {
  console.log('');
  console.log('usage: swagger-creator <command> <options>');
  console.log('available options:');
  console.log('generate - generate a mock. port (-p), swagger path (-s) and name (-n) can be specified');
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
    appName: args.name ? args.name: 'mock'
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
  console.log("VALIDATION CALLED. TODO: implement")
}

program.register('generate', generate);
program.register('validate', validate);
program.register('help', showHelp);
program.register('--help', showHelp);

function start(argv) {
  var remaining = program.parse(argv);
  if (remaining) { console.log('No matching command.'); }
}

module.exports = start;
if (require.main === module) {
  start(process.argv.slice(2));
}