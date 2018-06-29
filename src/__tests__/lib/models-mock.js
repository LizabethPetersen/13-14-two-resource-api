'use strict';

import faker from 'faker';
import Models from '../../model/models';
import mockMotoPromise from './moto-mock';

export default () => {
    const mockData = {};
    return mockMotoPromise()
    .then((newMoto) => {
        mockData.moto = newMoto;
    })
    .then(() => {
        const mockModels = {
            name: faker.lorem.words(2),
            cc: faker.random.number(4),
            engine: faker.lorem.words(3),
        };
        return new Models(mockModels).save();
    })
    .then((newModels) => {
        mockData.models = newModels;
        return mockData;
    })
    .catch((err) => {
        throw err;
    });
};