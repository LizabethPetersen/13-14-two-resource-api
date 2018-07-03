'use strict';

import superagent from 'superagent';
// import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Motorcycle from '../model/motorcycle';
import Specs from '../model/specs';
import createMockDataPromise from './lib/mock-moto';

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
          style: 'Sport',
          cc: 649,
          motorcycleId: mockData._id,
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
});

describe('GET /api/specs/:id?', () => {
  test('Send 200 GET for successful fetching of specs', () => {
    return createMockDataPromise()
      .then((mockSpecs) => {
        return superagent.get(`${apiUrl}/${mockSpecs._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      })
      .catch((err) => {
        throw err;
      });
  });
});
