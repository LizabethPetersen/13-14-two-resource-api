import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Specs from '../model/specs';

const specsRoute = new Router();

specsRoute.post('/api/specs', (request, response, next) => {
  logger.log(logger.INFO, 'S-Route POST to /api/specs - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'S-Route POST /api/specs: Responding with 400 error for no included name');
    const error = new Error('No style provided');
    error.status = 400;
    return next(error);
  }

  Specs.init()
    .then(() => {
      logger.log(logger.INFO, `S-Route POST before Save: ${JSON.stringify(request.body)}`);
      return new Specs(request.body).save();
    })
    .then((newSpecs) => {
      logger.log(logger.INFO, `S-Route POST after Save: ${JSON.stringify(newSpecs)}`);
      response.json(newSpecs);
    })
    .catch(next);
  return undefined;
});

specsRoute.get('/api/specs/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter an ID'));
  }

  Specs.init()
    .then(() => {
      return Specs.findOne({ _id: request.params.id });
    })
    .then((foundSpecs) => {
      logger.log(logger.INFO, `S-Route: After GET Specs ${JSON.stringify(foundSpecs)}`);
      return response.json(foundSpecs);
    })
    .catch(next);
  return undefined;
});

specsRoute.put('/api/specs/:id?', (request, response, next) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'S-Route PUT /api/specs: Responding with a 400 error code for no id passed in');
    return response.sendStatus(400);
  }
  
  const options = {
    new: true,
    runValidators: true,
  };
  
  Specs.init()
    .then(() => {
      return Specs.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedSpecs) => {
      logger.log(logger.INFO, `S-Route PUT: 200 status code for successfully updated specs: ${JSON.stringify(updatedSpecs)}`);
      return response.json(updatedSpecs);
    })
    .catch(next);
  return undefined;
});
  
specsRoute.delete('/api/specs/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'S-Route DELETE /api/specs/:id = Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'S-Route DELETE /api/specs: Responding with 400 error code for no objects found');
    return response.sendStatus(400);
  }
  return Specs.findByIdAndRemove(request.params.id)
    .then((specs) => {
      if (!specs) {
        logger.log(logger.INFO, 'S-Route DELETE: Responding with 404 status code for no specs found');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'S-Route DELETE: Responding with 204 status code for successful delete');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default specsRoute;
