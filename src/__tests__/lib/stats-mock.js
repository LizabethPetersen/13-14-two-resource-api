'use strict';

import faker from 'faker';
import Stats from '../../model/stats';
import mockMotoPromise from './moto-builder-mock';

export default () => {
    const mockData = {};
    return mockMotoPromise()
    .then((newMoto) => {
        mockData.moto = newMoto;
    })
    .then(() => {
        const mockStats = {
            cc: faker.random.number(4),
            engine: faker.lorem.words(3),
        };
        return new Stats(mockStats).save();
    })
    .then((newStats) => {
        mockData.stats = newStats;
        return mockData;
    })
    .catch((err) => {
        throw err;
    });
};