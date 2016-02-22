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
