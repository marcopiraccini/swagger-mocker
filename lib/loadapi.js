var Yaml = require('js-yaml');
var fs = require('fs');

function loadApi(apiPath) {
    if (apiPath.indexOf('.yaml') === apiPath.length - 5 || apiPath.indexOf('.yml') === apiPath.length - 4) {
        var api = fs.readFileSync(apiPath);
        return Yaml.load(api);
    }
    return require(apiPath);
}

module.exports = loadApi;
