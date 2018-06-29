'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Motorcycle from '../model/motorcycle';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/kawasaki-motos`;

const createMockMotoPromise = () => {
  return new Motorcycle({
    style: faker.lorem.words(2),
    year: faker.random.number(4),
  }).save();
};

beforeAll(startServer);
afterAll(stopServer);

// afterEach(() => Moto.remove({}));

describe('Tests POST requests to /api/kawasaki-motos', () => {
  test('Send 200 for successful build of motorcycle object', () => {
    const mockMotoToPost = {
      style: faker.lorem.words(2),
      year: faker.random.number(4),
    };
    return superagent.post(apiUrl)
      .send(mockMotoToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.style).toEqual(mockMotoToPost.style);
        expect(response.body.year).toEqual(mockMotoToPost.year);
        expect(response.body._id).toBeTruthy();
        expect(response.body.createdOn).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });

  test('Send 400 for not including a required style property', () => {
    const mockMotoToPost = {
      year: faker.random.number(4),
    };
    return superagent.post(apiUrl)
      .send(mockMotoToPost)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('POST 409 for duplicate key', () => {
    return createMockMotoPromise()
      .then((newMoto) => {
        return superagent.post(apiUrl)
          .send({ style: newMoto.style })
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

describe('Tests GET requests to api/kawasaki-motos', () => {
  test('Send 200 for a successful GET of a motorcycle object', () => {
    let mockMotoForGet;
    return createMockMotoPromise()
      .then((newMoto) => {
        mockMotoForGet = newMoto;
        return superagent.get(`${apiUrl}/${mockMotoForGet._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.style).toEqual(mockMotoForGet.style);
        expect(response.body.year).toEqual(mockMotoForGet.year);
      })
      .catch((err) => {
        throw err;
      });
  });
  test('Send 404 GET: no motorcycle with this id', () => {
    return superagent.get(`${apiUrl}/THISISABADID`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});

describe('Tests PUT requests to api/kawasaki-motos', () => {
  test('Send 200 for successful updating of a motorcycle', () => {
    return createMockMotoPromise()
      .then((newMoto) => {
        return superagent.put(`${apiUrl}/${newMoto._id}`)
          .send({ style: 'updated style', year: 'updated year' })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.style).toEqual('updated style');
            expect(response.body.year).toEqual('updated year');
            expect(response.body._id.toString()).toEqual(newMoto._id.toString());
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

describe('Tests DELETE requests to api/kawasaki-motos', () => {
  test('Sends 204 for successful deletion of one object', () => {
    let mockMotoForDelete;
    return createMockMotoPromise()
      .then((testMoto) => {
        mockMotoForDelete = testMoto;
        return superagent.delete(`${apiUrl}/${mockMotoForDelete._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(204);
      })
      .catch((err) => {
        throw err;
      });
  });
  test('Send 404 DELETE: no motorcycle with this id', () => {
    return superagent.delete(`${apiUrl}/THISISABADID`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});
