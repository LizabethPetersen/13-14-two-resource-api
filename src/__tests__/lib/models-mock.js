'use strict';

import faker from 'faker';
import Model from '../../model/models';
import mockMotoResource from './moto-mock';

export default () => {
  const mockData = {};
  return mockMotoResource()
    .then((newMotorcyclercycle) => {
      mockData.motorcycle = newMotorcyclercycle;
    })
    .then(() => {
      const mockModel = {
        name: faker.lorem.words(2),
        cc: faker.random.number(4),
        styleId: mockData.style._id,
      };
      return new Model(mockModel).save();
    })
    .then((newModel) => {
      mockData.model = newModel;
      return mockData;
    })
    .catch((err) => {
      throw err;
    });
};
