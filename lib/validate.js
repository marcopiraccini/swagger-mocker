'use strict';

var swaggerSpec = require('swagger-tools').specs.v2_0;
var loadApi = require('./loadapi');

function validateSwagger(swaggerPath, cb) {

  var swagger = loadApi(swaggerPath);

  swaggerSpec.validate(swagger, function(err, results) {
    if (err) { return cb(err); }

    var toJsonPointer = function (path) {
      // http://tools.ietf.org/html/rfc6901#section-4
      return '#/' + path.map(function (part) {
          return part.replace(/\//g, '~1');
        }).join('/');
    };

    if (results) {
        if (results.errors.length > 0) {
          console.log('\nProject Errors');
          console.log('--------------');

          results.errors.forEach(function (vErr) {
            console.log(toJsonPointer(vErr.path) + ': ' + vErr.message);
          });
        }

        if (results.warnings.length > 0) {
          console.log('\nProject Warnings');
          console.log('----------------');

          results.warnings.forEach(function (vWarn) {
            console.log(toJsonPointer(vWarn.path) + ': ' + vWarn.message);
          });
        }

        cb(null, 'Results: ' + results.errors.length + ' errors, ' + results.warnings.length + ' warnings');

    } else {
      cb(null, 'Results: 0 errors, 0 warnings');
    }
  });
}

module.exports = validateSwagger;
