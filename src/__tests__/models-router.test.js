'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Motorcycle from '../model/motorcycle';
import Models from '../model/models';
import createMockDataPromise from './lib/models-mock';
import motoMock from './lib/moto-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/models`;

beforeAll(startServer);
afterAll(stopServer);

afterEach(() => {
  Promise.all([
    Motorcycle.remove({}),
    Models.remove({}),
  ]);
});

describe('POST /api/models', () => {
  test('Send 200 for successful posting of a model', () => {
    return createMockDataPromise()
      .then((mockData) => {
        const mockModels = {
          name: faker.lorem.word(1),
          cc: faker.random.number(3),
          engine: faker.lorem.words(3),
          styleId: mockData.style._id,
        };
        return superagent.post(apiUrl)
          .send(mockModels)
          .then((response) => {
            expect(response.status).toEqual(200);
          })
          .catch((err) => {
            throw err;
          });
      });
  });

  test('Send 400 for not including a required name property', () => {
    const mockDataToPost = {
      cc: faker.random.number(3),
      engine: faker.lorem.words(3),
      styleId: motoMock.style._id,
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
          .send({ name: mockData.name })
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

describe('GET /api/stats', () => {
  test('Send 200 GET for successful fetching of models', () => {
    return createMockDataPromise()
      .then((mockData) => {
        return superagent.get(`${apiUrl}/${mockData.model._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      })
      .catch((err) => {
        throw err;
      });
  });
  test('Send 404 GET: no model with this id', () => {
    return superagent.get(`${apiUrl}/THISISABADID`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});
    
describe('Tests PUT requests to api/models', () => {
  test('Send 200 for successful updating of a model', () => {
    return createMockDataPromise()
      .then((updatedModel) => {
        return superagent.put(`${apiUrl}/${updatedModel._id}`)
          .send({ name: 'updated name', cc: 'updated cc', engine: 'updated engine' })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.name).toEqual('updated name');
            expect(response.body.cc).toEqual('updated cc');
            expect(response.body.engine).toEqual('updated engine');
            expect(response.body._id.toString()).toEqual(updatedModel._id.toString());
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  });
});
    
describe('Tests DELETE requests to api/models', () => {
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
