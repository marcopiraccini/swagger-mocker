module.exports = {
    get: function (req, reply) {
        return reply("GET");
    },
    post: function (req, reply) {
      return reply("POST");
    },
    put: function (req, reply) {
        return reply("GET");
    },
    delete: function (req, reply) {
      return reply("POST");
    }
}
