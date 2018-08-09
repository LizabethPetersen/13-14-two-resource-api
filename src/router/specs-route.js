import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Specs from '../model/specs';

const specsRoute = new Router();

// This is where I could CREATE TABLE (see specs model for SQL schema) for my specs

specsRoute.post('/api/specs', (request, response, next) => {
  logger.log(logger.INFO, 'S-Route POST to /api/specs - processing a request');
  if (!request.body.style) {
    logger.log(logger.INFO, 'S-Route POST /api/specs: Responding with 400 error for no included style');
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

// This is where I can return specs for a motorcycle or all data through OUTER JOIN 

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

// My PUT route could UPDATE specs for a motorcycle

// My DELETE route could DELETE FROM specs, though this would be better served through deleting the motorcycle that the specs are attached to.
// However, in SQL tables, I would likely need to delete both the specs and the moto they are associated with.

export default specsRoute;
