'use strict';

import { Router } from 'express';
// import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Motorcycle from '../model/motorcycle';

const motorcycleRoute = new Router();

motorcycleRoute.post('/api/kawasakis', (request, response, next) => {
  Motorcycle.init()
    .then(() => {
      logger.log(logger.INFO, `MOTO ROUTER BEFORE SAVE: Saved a new motorcycle ${JSON.stringify(request.body)}`);
      return new Motorcycle(request.body).save();
    })
    .then((newMotorcycle) => {
      logger.log(logger.INFO, `MOTO ROUTER AFTER SAVE: Saved a new motorcycle ${JSON.stringify(newMotorcycle)}`);
      return response.json(newMotorcycle);
    })
    .catch(next);
});

motorcycleRoute.get('/api/kawasakis/:id?', (request, response, next) => {
  Motorcycle.init()
    .then(() => {
      return Motorcycle.findOne({ _id: request.params.id });
    })
    .then((foundMotorcycle) => {
      logger.log(logger.INFO, `M-Route Found a Motorcycle: ${JSON.stringify(foundMotorcycle)}`);
      response.json(foundMotorcycle);
    })
    .catch(next);
});
// if (!request.params.id) {
// return next(new HttpErrors(400, 'Did not enter an ID'));
// }
  
  
/*
classRoomRouter.get('/api/classrooms/:id?', (request, response, next) => {
  Classroom.init()
    .then(() => {
      return Classroom.findOne({ _id: request.params.id });
    })
    .then((foundClassroom) => {
      logger.log(logger.INFO, `CLASSROOM ROUTER: FOUND THE MODEL, ${JSON.stringify(foundClassroom)}`);
      response.json(foundClassroom);
    })
    .catch(next);
});

*/

// motorcycleRoute.put('/api/kawasakis/:id?', (request, response, next) => {
//   if (!request.params.id) {
//     logger.log(logger.INFO, 'M-Route PUT /api/kawasakis: Responding with a 400 error code for no id passed in');
//     return response.sendStatus(400);
//   }

//   const options = {
//     new: true,
//     runValidators: true,
//   };

//   Motorcycle.init()
//     .then(() => {
//       return Motorcycle.findByIdAndUpdate(request.params.id, request.body, options);
//     })
//     .then((updatedMoto) => {
//       logger.log(logger.INFO, `M-Route PUT: Responding with a 200 status code for successfully updated motorcycle: ${JSON.stringify(updatedMoto)}`);
//       return response.json(updatedMoto);
//     })
//     .catch(next);
//   return undefined;
// });

// motorcycleRoute.delete('/api/kawasakis/:id?', (request, response, next) => {
//   logger.log(logger.INFO, 'M-Route DELETE /api/kawasakis/:id - Processing a request');
//   if (!request.params.id) {
//     logger.log(logger.INFO, 'M-Route DELETE /api/kawasakis: Responding with 400 error code for no objects found');
//     return response.sendStatus(400);
//   }
//   return Motorcycle.findByIdAndRemove(request.params.id)
//     .then((motorcycle) => {
//       if (!motorcycle) {
//         logger.log(logger.INFO, 'DELETE: Responding with 404 status code for no motorcycle found');
//         return response.sendStatus(404);
//       }
//       logger.log(logger.INFO, 'DELETE: Responding with 204 status code for successful delete');
//       return response.sendStatus(204);
//     })
//     .catch(next);
// });

export default motorcycleRoute;

