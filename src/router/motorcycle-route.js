'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import Motorcycle from '../model/moto-builder';

const motorcycleRouter = new Router();

motorcycleRouter.post('/api/kawasaki-motos', (request, response, next) => {
  logger.log(logger.INFO, 'Moto-Router POST to /api/kawasaki-motos - processing a request');
  if (!request.body.style) {
    logger.log(logger.INFO, 'Moto-Router POST /api/kawasaki-motos: Responding with 400 error for no included style');
    const error = new Error('No style provided');
    error.status = 400;
    return next(error);
  }

  Motorcycle.init()
    .then(() => {
      return new Motorcycle(request.body).save();
    })
    .then((newMotorcycle) => {
      logger.log(logger.INFO, `Moto-Router POST: A new motorcycle was built: ${JSON.stringify(newMotorcycle)}`);
      return response.json(newMotorcycle);
    })
    .catch(next);
  return undefined;
});

motorcycleRouter.get('/api/kawasaki-motos/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'Moto-Router GET /api/kawasaki-motos/:id = Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'Moto-Router GET /api/kawasaki-motos: Responding with a 404 error code for no objects found');
    return response(404, {});
  }
  return Motorcycle.findOne({ _id: request.params.id })
    .then((motorcycle) => {
      if (!motorcycle) {
        logger.log(logger.INFO, 'Moto-Router GET: Responding with 404 status code for no motorcycle found');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'Moto-Router GET: Responding with 200 status code for successful get');
      return response.json(motorcycle);
    })
    .catch(next);
});

motorcycleRouter.put('/api/kawasaki-motos/:id?', (request, response, next) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'PUT /api/kawasaki-motos: Responding with a 400 error code for no id passed in');
    return response.sendStatus(400);
  }

  const options = {
    new: true,
    runValidators: true,
  };

  Motorcycle.init()
    .then(() => {
      return Motorcycle.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedMotorcycle) => {
      logger.log(logger.INFO, `PUT: Responding with a 200 status code for successfully updated motorcycle: ${JSON.stringify(updatedMotorcycle)}`);
      return response.json(updatedMotorcycle);
    })
    .catch(next);
  return undefined;
});

motorcycleRouter.delete('/api/kawasaki-motos/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'Moto-Router DELETE /api/kawasaki-motos/:id = Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'Moto-Router DELETE /api/kawasaki-motos: Responding with 400 error code for no objects found');
    return response.sendStatus(400);
  }
  return Motorcycle.findByIdAndRemove(request.params.id)
    .then((motorcycle) => {
      if (!motorcycle) {
        logger.log(logger.INFO, 'DELETE: Responding with 404 status code for no motorcycle found');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE: Responding with 204 status code for successful delete');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default motorcycleRouter;
