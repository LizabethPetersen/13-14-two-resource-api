'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Motorcycle from '../model/moto-builder';
import Stats from '../model/stats';
import createMockDataPromise from './moto-builder-router.test';

const apiUrl = `http://localhost:${process.env.PORT}/api/stats`;

beforeAll(startServer);
afterAll(stopServer);

afterEach(() => {
    Promise.all([
        Motorcycle.remove({}),
        Stats.remove({}),
    ]);
});

describe('POST /api/stats', () => {
    test('Send 200 for successful posting of stats', () => {
        return createMockDataPromise()
        .then((mockData) => {
            const mockStats = {
                cc: faker.random.number(4),
                engine: faker.lorem.words(3),
                modelId: mockData.moto.id,
            };
            return superagent.post(apiUrl)
            .send(mockStats)
            .then((response) => {
                expect(response.status).toEqual(200);
            })
            .catch((err) => {
                throw err;
            });
        });
    });

    test('Send 400 for not including a required cc property', () => {
        const mockDataToPost = {
            engine: faker.lorem.words(3),
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
                  .send({ cc: mockData.cc })
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
    test('Send 200 GET for successful fetching of stats', () => {
        return createMockDataPromise()
        .then((mockData) => {
            return superagent.get(`${apiUrl}/${mockData.stats_id}`);
        })
        .then((response) => {
            expect(response.status).toEqual(200);
        })
        .catch((err) => {
            throw err;
        });
    });
});
