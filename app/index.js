var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var Yaml = require('js-yaml');
var Routes = require('swaggerize-routes');
var Utils = require('swaggerize-routes/lib/utils');
var fs = require('fs');
var mkdirp = require('mkdirp');

var SwaggerGenerator = yeoman.Base.extend({

  info: function() {
    console.log('Creating a swagger mock!! \n');
  },

  generateBasic: function() {
    this.appName = this.options.appName;
    this.port = this.options.port;
    var swaggerPath = this.options.swaggerPath;
    var swaggerName = path.basename(swaggerPath);
    this.swaggerApi = './config/' + swaggerName;

    this.template('./_index.js', 'test/' + this.options.appName + '/index.js');
    this.template('./_package.json', 'test/' + this.options.appName + '/package.json');
    this.copy('./swagger-plugin.js', 'test/' + this.options.appName + '/swagger-plugin.js');
    this.copy('./loadapi.js', 'test/' + this.options.appName + '/loadapi.js');
    this.copy(swaggerPath, 'test/' + this.options.appName + '/config/' + swaggerName);
    mkdirp.sync(this.destinationPath('test/' + this.options.appName + '/handlers'));

    // Generates the handlers, one for each path.
    var api = loadApi(swaggerPath);
    Object.keys(api.paths).forEach(function (path) {
      var  pathnames = [];
      // Figure out the names from the params.
      path.split('/').forEach(function (element) {
          if (element) {
                pathnames.push(element);
            }
        });
        this.copy('handlers/handler.js', 'test/' + this.options.appName + '/handlers/' + pathnames[0] + '.js');
      }, this);
    },

  end: function() {
  }
});

function loadApi(apiPath) {
    if (apiPath.indexOf('.yaml') === apiPath.length - 5 || apiPath.indexOf('.yml') === apiPath.length - 4) {
        return Yaml.load(fs.readFileSync(apiPath));
    }
    return require(apiPath);
}

function matchpath(method, pathnames, handlers) {
    if (!handlers) {
        return null;
    }
    if (pathnames.length > 1) {
        pathnames.shift();
        return matchpath(method, pathnames, handlers[pathnames[0]]);
    }

    return handlers[pathnames[0]] ? handlers[pathnames[0]] : handlers[method];
}

module.exports = SwaggerGenerator;
