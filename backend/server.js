// Imports
const http = require('http');
const normalizePort = require('normalize-port');
const app = require('./app');

// Instanciate server
const server = http.createServer(app);

// Normalize port
const port = normalizePort(process.env.PORT || '3000');

// Error handler
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
server.on('error', errorHandler);

// Server listen to port
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});