'use strict';

import faker from 'faker';
import Version from '../../model/version';
import mockMotoResource from './moto-mock';

export default () => {
  const mockData = {};
  return mockMotoResource()
    .then((newMotorcycle) => {
      // not sure what the mockData is for??? research and rename for better understanding
      mockData.motorcycle = newMotorcycle;
    })
    .then(() => {
      console.log(mockData, 'thia;sdalkdgakl;dga;eoterpotudfgl,cvnadfajkldgjdl;');
      const mockVersion = {
        name: faker.lorem.words(2),
        cc: faker.random.number(4),
        styleId: mockData.motorcycle._id,
      };
      return new Version(mockVersion).save();
    })
    .then((newModel) => {
      mockData.model = newModel;
      return mockData;
    })
    .catch((err) => {
      throw err;
    });
};
