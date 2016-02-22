# Swagger Mocker

> **Mock generator and validator for swagger**

Inspired by <https://github.com/krakenjs/swaggerize-hapi>, it generates an HAPI based mock skeleton

### How to run it

Install it globally with `npm i swagger-mocker -g`, then:

` swagger-mocker create -s swagger.json -n mymock -t ~/test`

That will create the mock in `~/test/mymock`

`npm install` is not launched automatically, you have to do it by yourself.

This tool can be used also for validation:

`swagger-mocker validate -s swagger.json`

### Handlers

Handlers skeleton are created into the `handlers` folder, starting from each path/verb defined in the swagger definition.
Starting from these, you can add mock responses easily. The basic structure for an handler is:

```
module.exports = {
    get: function (req, reply) {
        return reply("GET");
    },
    post: function (req, reply) {
      return reply("POST");
    },
    put: function (req, reply) {
        return reply("PUT");  
    },
    delete: function (req, reply) {
      return reply("DELETE");
    }
}
```

For instance, using the petstore swagger, the created handlers are:

```
handlers/pet.js
handlers/pet/findByStatus.js
handlers/pet/findByTags.js
handlers/pet/{petId}.js
handlers/pet/{petId}/uploadImage.js
handlers/store/inventory.js
handlers/store/order.js
handlers/store/order/{orderId}.js
handlers/user.js
handlers/user/createWithArray.js
handlers/user/createWithList.js
handlers/user/login.js
handlers/user/logout.js
handlers/user/{username}.js
```

### Options defaults
<table><tbody>
<tr><td align="left">-p</td><td>--port</td><td>10010</td></tr>
<tr><td align="left">-n</td><td>--name</td><td>mock</td></tr>
<tr><td align="left">-t</td><td>--target</td><td>test</td></tr>
</tbody></table>

## Contributors

__`swagger-mocker`__ has been created by:

<table><tbody>
<tr><th align="left">Marco Piraccini</th><td><a href="https://github.com/marcopiraccini">GitHub/MarcoPiraccini</a></td><td><a href="http://twitter.com/marcopiraccini">Twitter/@MarcoPiraccini</a></td></tr>
</tbody></table>

## License
**Swagger Mocker** is Copyright (c) 2016
swagger-mocker contributors (listed above) and licensed under the MIT licence.
See the included [LICENSE](./LICENSE) file for more details
