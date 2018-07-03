'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
// import Motorcycle from '../model/motorcycle';
import mockMotoResource from './lib/mock-moto';

const apiUrl = `http://localhost:${process.env.PORT}/api/kawasakis`;

beforeAll(startServer);
afterAll(stopServer);
// afterEach(() => Motorcycle.remove({}));

describe('POST /api/kawasakis', () => {
  const mockMoto = {
    name: faker.lorem.words(4),
    year: '2018',
  };

  test('Send 200 for successful post of motorcycle object', () => { 
    return superagent.post(apiUrl)
      .send(mockMoto)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(mockMoto.name);
        expect(response.body.year).toEqual(mockMoto.year);
        expect(response.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });

  test('Send 400 for no included name property', () => {
    return superagent.post(apiUrl)
      .send(mockMoto)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('POST 409 for duplicate key', () => {
    return mockMotoResource()
      .then((newMotorcycle) => {
        return superagent.post(apiUrl)
          .send({ name: newMotorcycle.name })
          .then((response) => {
            throw response;
          })
          .catch((err) => {
            expect(err.status).toEqual(409);
          });
      })
      .catch((err) => {
        throw err;
      });
  });
});

describe('GET api/kawasakis/:id?', () => {
  test('Send 200 for successful retrieval of a motorcycle', () => {
    let returnedMotorcycle;
    return mockMotoResource()
      .then((newMotorcycle) => {
        returnedMotorcycle = newMotorcycle;
        return superagent.get(`${apiUrl}/${newMotorcycle._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(returnedMotorcycle.name);
        expect(response.body.year).toEqual(returnedMotorcycle.year);
      })
      .catch((err) => {
        throw err;
      });
  });

  test('Send 400 GET: no motorcycle with this id', () => {
    return superagent.get(`${apiUrl}/THISISABADID`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        throw err;
      });
  });
});

// describe('PUT request to api/kawasakis/:id?', () => {
//   test('Send 200 for successful update', () => {
//     let updatedMotorcycle;
//     return createMockMotoPromise()
//       .then((newMotorcycle) => {
//         updatedMotorcycle = newMotorcycle;
//         return superagent.put(`${apiUrl}/${newMotorcycle._id}`)
//           .send({ name: 'updated name', year: 'updated year' })
//           .then((response) => {
//             expect(response.status).toEqual(200);
//             expect(response.body.name).toEqual(updatedMotorcycle.name);
//             expect(response.body.year).toEqual(updatedMotorcycle.year);
//             expect(response.body._id).toBeTruthy();
//           })
//           .catch((err) => {
//             throw err;
//           });
//       })
//       .catch((err) => {
//         throw err;
//       });
//   });
// });

// describe('Tests DELETE requests to api/kawasakis/:id?', () => {
//   test('Sends 204 for successful deletion of one object', () => {
//     return createMockMotoPromise()
//     // I think this is going to need the mock data set-up like in the GET and PUT blocks; otherwise
//     // what does test moto equal? (createMockMotoPromise?)
//       .then((testMoto) => {
//         return superagent.delete(`${apiUrl}/${testMoto._id}`);
//       })
//       .then((response) => {
//         expect(response.status).toEqual(204);
//       })
//       .catch((err) => {
//         throw err;
//       });
//   });
//   test('Send 404 DELETE: no motorcycle with this id', () => {
//     return superagent.delete(`${apiUrl}/THISISABADID`)
//       .then((response) => {
//         throw response;
//       })
//       .catch((err) => {
//         expect(err.status).toEqual(404);
//       });
//   });
// });
