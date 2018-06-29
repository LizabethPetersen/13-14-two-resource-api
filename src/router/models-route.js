import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Model from '../model/models';

const modelsRoute = new Router();

modelsRoute.post('/api/models', (request, response, next) => {
  logger.log(logger.INFO, 'Motorcycle Route POST to /api/kawasakis - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'Motorcycle Route POST /api/kawasakis: Responding with 400 error for no included name');
    const error = new Error('No name provided');
    error.status = 400;
    return next(error);
  }

  Model.init()
    .then(() => {
      logger.log(logger.INFO, `Model Route: POST before Save: ${JSON.stringify(request.body)}`);
      return new Model(request.body).save();
    })
    .then((newModel) => {
      logger.log(logger.INFO, `Model Route: POST after Save: ${JSON.stringify(newModel)}`);
      response.json(newModel);
    })
    .catch(next);
  return undefined;
});

modelsRoute.get('/api/models/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter an ID'));
  }

  Model.init()
    .then(() => {
      return Model.findOne({ _id: request.params.id });
    })
    .then((foundModel) => {
      logger.log(logger.INFO, `Model Route: After GET Model ${JSON.stringify(foundModel)}`);
      return response.json(foundModel);
    })
    .catch(next);
  return undefined;
});

modelsRoute.put('/api/models/:id?', (request, response, next) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'PUT /api/models: Responding with a 400 error code for no id passed in');
    return response.sendStatus(400);
  }
  
  const options = {
    new: true,
    runValidators: true,
  };
  
  Model.init()
    .then(() => {
      return Model.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedModel) => {
      logger.log(logger.INFO, `PUT: Responding with a 200 status code for successfully updated model: ${JSON.stringify(updatedModel)}`);
      return response.json(updatedModel);
    })
    .catch(next);
  return undefined;
});
  
modelsRoute.delete('/api/models/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'Model Route DELETE /api/models/:id = Processing a request');
  if (!request.params.id) {
    logger.log(logger.INFO, 'Model Route DELETE /api/models: Responding with 400 error code for no objects found');
    return response.sendStatus(400);
  }
  return Model.findByIdAndRemove(request.params.id)
    .then((model) => {
      if (!model) {
        logger.log(logger.INFO, 'DELETE: Responding with 404 status code for no model found');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE: Responding with 204 status code for successful delete');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default modelsRoute;
