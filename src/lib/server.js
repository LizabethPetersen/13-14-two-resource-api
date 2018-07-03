'use strict';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './logger';
import motorcycleRoute from '../router/motorcycle-route';
import specsRoute from '../router/specs-route';

import loggerMiddleware from './middleware/logger-middleware';
import errorMiddleware from './middleware/error-middleware';

const app = express();
const PORT = process.env.PORT || 3000;
let server = null;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(loggerMiddleware);
app.use(motorcycleRoute);
app.use(specsRoute);

app.use(errorMiddleware);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'SERVER: Returning a 404 status from the catch-all default route');
  return response.status(404).send('Route not registered');
});

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`); /* eslint-disable-line */
      });
    })
    .catch((err) => {
      throw err;
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    })
    .catch((err) => {
      throw err;
    });
};

export { startServer, stopServer };
