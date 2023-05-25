import debug from 'debug';
import * as http from 'http';
import app from './app';

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
// eslint-disable-next-line @typescript-eslint/no-use-before-define
server.on('error', onError);
// eslint-disable-next-line @typescript-eslint/no-use-before-define
server.on('listening', onListening);

function normalizePort(value: string): number | string | boolean {
  const parsedValue = parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    return value;
  }

  if (parsedValue >= 0) {
    return parsedValue;
  }

  return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr?.port}`;
  debug(`Listening on ${bind}`);
}
