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
});
