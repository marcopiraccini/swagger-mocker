'use strict';

/**
 * HAPI plugin that creates the routes from swagger definition
 */
var Routes = require('swaggerize-routes');
var Utils = require('swaggerize-routes/lib/utils');
var Joi = require('joi');
var fs = require('fs');
var Thing = require('core-util-is');
var loadApi = require('./loadapi');


module.exports = {
    register: function (server, options, next) {
        var routes, basePath;
        options.api = loadApi(options.api);
        options.basedir = options.basedir || process.cwd();
        options.docspath = Utils.prefix(options.docspath || '/api-docs', '/');
        options.api.basePath = Utils.prefix(options.api.basePath || '/', '/');
        basePath = Utils.unsuffix(options.api.basePath, '/');

        //Build routes
        routes = Routes(options);

        //API docs route
        server.route({
            method: 'GET',
            path: basePath + options.docspath,
            config: {
                handler: function (request, reply) {
                    reply(options.api);
                },
                cors: options.cors
            },
            vhost: options.vhost
        });

        //Add all known routes
        routes.forEach(function (route) {

            var config;

            config = {
                pre: [],
                handler: undefined,
                cors: options.cors
            };

            //Addition before ops supplied in handler file (as array)
            if (Thing.isArray(route.handler)) {
                if (route.handler.length > 1) {
                    for (var i = 0; i < route.handler.length - 1; i++) {
                        config.pre.push({
                            assign: route.handler[i].name || 'p' + (i + 1),
                            method: route.handler[i]
                        });
                    }
                }
                config.handler = route.handler[route.handler.length - 1];
            }
            else {
                config.handler = route.handler;
            }

            if (route.validators.length) {
                config.validate = {};

                //Input validation
                route.validators.forEach(function (validator) {
                    switch (validator.parameter.in) {
                        case 'header':
                            config.validate.headers = config.validate.headers || {};
                            config.validate.headers[validator.parameter.name] = validator.schema;
                            break;
                        case 'query':
                            config.validate.query = config.validate.query || {};
                            config.validate.query[validator.parameter.name] = validator.schema;
                            break;
                        case 'path':
                            config.validate.params = config.validate.params || {};
                            config.validate.params[validator.parameter.name] = validator.schema;
                            break;
                        case 'body':
                            config.validate.payload = validator.schema;
                            break;
                        case 'formData':
                            config.validate.payload = function (value, options, next) {
                                validator.validate(value, next);
                            };
                            break;
                    }
                });
            }

            //Define the route
            server.route({
                method: route.method,
                path: basePath + route.path,
                config: config,
                vhost: options.vhost
            });
        });

        //Expose plugin api
        server.expose({
            api: options.api,
            setHost: function setHost(host) {
                this.api.host = options.api.host = host;
            }
        });

        //Done
        next();
    }
};


module.exports.register.attributes = {
    name: 'swagger',
    version: '0.0.1'
};
