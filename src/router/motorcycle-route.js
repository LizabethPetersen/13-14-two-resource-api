'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import Motorcycle from '../model/motorcycle';

const motorcycleRoute = new Router();

motorcycleRoute.post('/api/kawasakis', (request, response, next) => {
  logger.log(logger.INFO, 'M-Route POST to /api/kawasakis - processing a request');
  if (!request.body.style) {
    logger.log(logger.INFO, 'M-Route POST to /api/kawasakis: Responding with 400 error for no included style');
    const error = new Error('No style provided');
    error.status = 400;
    return next(error);
  }

  Motorcycle.init()
    .then(() => {
      return new Motorcycle(request.body).save();
    })
    .then((newMotorcycle) => {
      logger.log(logger.INFO, `M-Route POST: A new motorcycle was built: ${JSON.stringify(newMotorcycle)}`);
      return response.json(newMotorcycle);
    })
    .catch(next);
  return undefined;
});

motorcycleRoute.get('/api/kawasakis/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'M-Route GET: /api/kawasakis/:id? - Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'M-Route GET: /api/kawasakis/:id? - Responding with a 404 error code for no objects found');
    return response(404, {});
  }
  return Motorcycle.findOne({ _id: request.params.id })
    .then((motorcycle) => {
      if (!motorcycle) {
        logger.log(logger.INFO, 'M-Route GET: Responding with 404 status code for no motorcycle found');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'M-Route GET: Responding with 200 status code for successful get');
      return response.json(motorcycle);
    })
    .catch(next);
});

motorcycleRoute.put('/api/kawasakis/:id?', (request, response, next) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'M-Route PUT /api/kawasakis: Responding with a 400 error code for no id passed in');
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
    .then((updatedMoto) => {
      logger.log(logger.INFO, `M-Route PUT: Responding with a 200 status code for successfully updated motorcycle: ${JSON.stringify(updatedMoto)}`);
      return response.json(updatedMoto);
    })
    .catch(next);
  return undefined;
});

motorcycleRoute.delete('/api/kawasakis/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'M-Route DELETE /api/kawasakis/:id - Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'M-Route DELETE /api/kawasakis: Responding with 400 error code for no objects found');
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

export default motorcycleRoute;
