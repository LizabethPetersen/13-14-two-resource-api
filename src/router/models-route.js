import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Version from '../model/version';

const versionRoute = new Router();

versionRoute.post('/api/version', (request, response, next) => {
  logger.log(logger.INFO, 'V-Route POST to /api/version - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'V-Route POST /api/version: Responding with 400 error for no included name');
    const error = new Error('No name provided');
    error.status = 400;
    return next(error);
  }

  Version.init()
    .then(() => {
      logger.log(logger.INFO, `V-Route POST before Save: ${JSON.stringify(request.body)}`);
      return new Version(request.body).save();
    })
    .then((newVersion) => {
      logger.log(logger.INFO, `V-Route POST after Save: ${JSON.stringify(newVersion)}`);
      response.json(newVersion);
    })
    .catch(next);
  return undefined;
});

versionRoute.get('/api/version/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter an ID'));
  }

  Version.init()
    .then(() => {
      return Version.findOne({ _id: request.params.id });
    })
    .then((foundVersion) => {
      logger.log(logger.INFO, `V-Route: After GET Model ${JSON.stringify(foundVersion)}`);
      return response.json(foundVersion);
    })
    .catch(next);
  return undefined;
});

versionRoute.put('/api/version/:id?', (request, response, next) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'V-Route PUT /api/version: Responding with a 400 error code for no id passed in');
    return response.sendStatus(400);
  }
  
  const options = {
    new: true,
    runValidators: true,
  };
  
  Version.init()
    .then(() => {
      return Version.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedVersion) => {
      logger.log(logger.INFO, `V-Route PUT: Responding with a 200 status code for successfully updated model: ${JSON.stringify(updatedVersion)}`);
      return response.json(updatedVersion);
    })
    .catch(next);
  return undefined;
});
  
versionRoute.delete('/api/version/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'V-Route DELETE /api/version/:id = Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'V-Route DELETE /api/version: Responding with 400 error code for no objects found');
    return response.sendStatus(400);
  }
  return Version.findByIdAndRemove(request.params.id)
    .then((version) => {
      if (!version) {
        logger.log(logger.INFO, 'V-Route DELETE: Responding with 404 status code for no version found');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'V-Route DELETE: Responding with 204 status code for successful delete');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default versionRoute;
