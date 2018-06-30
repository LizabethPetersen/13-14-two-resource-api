'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Motorcycle from '../model/motorcycle';
import Specs from '../model/specs';
import createMockDataPromise from './lib/mock-specs';

const apiUrl = `http://localhost:${process.env.PORT}/api/specs`;

beforeAll(startServer);
afterAll(stopServer);

afterEach(() => {
  Promise.all([
    Motorcycle.remove({}),
    Specs.remove({}),
  ]);
});

describe('POST /api/specs', () => {
  test('Send 200 for successful posting of specs', () => {
    return createMockDataPromise()
      .then((mockData) => {
        const mockSpecs = {
          style: faker.lorem.words(2),
          cc: faker.random.number(1),
          motorcycleId: mockData.motorcycle._id,
        };
        return superagent.post(apiUrl)
          .send(mockSpecs)
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.style).toEqual(mockSpecs.style);
            expect(response.body.cc).toEqual(mockSpecs.cc);
            expect(response.body._id).toBeTruthy();
          })
          .catch((err) => {
            throw err;
          });
      });
  });

  test('Send 400 for no required style property', () => {
    const mockDataToPost = {
      cc: faker.random.number(1),
    };
    return superagent.post(apiUrl)
      .send(mockDataToPost)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
        
  test('POST 409 for duplicate key', () => {
    return createMockDataPromise()
      .then((mockData) => {
        return superagent.post(apiUrl)
          .send({ style: mockData.style })
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

describe('GET /api/specs/:id?', () => {
  test('Send 200 GET for successful fetching of specs', () => {
    return createMockDataPromise()
      .then((mockData) => {
        return superagent.get(`${apiUrl}/${mockData.specs._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      })
      .catch((err) => {
        throw err;
      });
  });
});

// test('Send 404 GET: no model with this id', () => {
// return superagent.get(`${apiUrl}/THISISABADID`)
// .then((response) => {
// throw response;
// })
// .catch((err) => {
// expect(err.status).toEqual(404);
// });
// });
// });
    
// describe('Tests PUT requests to api/models', () => {
// test('Send 200 for successful updating of a model', () => {
// return createMockDataPromise()
// .then((updatedModel) => {
// return superagent.put(`${apiUrl}/${updatedModel._id}`)
// .send({ name: 'updated name', cc: 'updated cc', engine: 'updated engine' })
// .then((response) => {
// expect(response.status).toEqual(200);
// expect(response.body.name).toEqual('updated name');
// expect(response.body.cc).toEqual('updated cc');
// expect(response.body._id.toString()).toEqual(motorcycle._id.toString());
// })
// .catch((err) => {
// throw err;
// });
// })
// .catch((err) => {
// throw err;
// });
// });
// });
    
describe('Tests DELETE requests to api/specs/:id?', () => {
  test('Sends 204 for successful deletion of one object', () => {
    let mockModelForDelete;
    return createMockDataPromise()
      .then((testModel) => {
        mockModelForDelete = testModel;
        return superagent.delete(`${apiUrl}/${mockModelForDelete._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(204);
      })
      .catch((err) => {
        throw err;
      });
  });
  test('Send 404 DELETE: no model with this id', () => {
    return superagent.delete(`${apiUrl}/THISISABADID`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});
