'use strict';

import faker from 'faker';
import Motorcycle from '../../model/motorcycle';

export default () => {
  const mockMotoResource = {
    name: faker.lorem.words(4),
    year: '2018',
  };
  return new Motorcycle(mockMotoResource).save();
};
