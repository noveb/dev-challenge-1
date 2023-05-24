#!/usr/bin/env node

/**
 * Module dependencies.
 */

import debug from 'debug';
import * as http from 'http';
import app from './app';

/**
 * Get port from environment and store in Express.
 */

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
// eslint-disable-next-line @typescript-eslint/no-use-before-define
server.on('error', onError);
// eslint-disable-next-line @typescript-eslint/no-use-before-define
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

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

/**
 * Event listener for HTTP server "error" event.
 */

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

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr?.port}`;
  debug(`Listening on ${bind}`);
}
