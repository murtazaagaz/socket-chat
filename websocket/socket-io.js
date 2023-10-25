let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server);
    return io;
  },
  getIo: () => {
    if (io) {
      return io;
    }
    throw "Socket Not Initialised";
  },
};
