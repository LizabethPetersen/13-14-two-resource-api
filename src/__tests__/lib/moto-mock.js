'use strict';

import faker from 'faker';
import Motorcycle from '../../model/motorcycle';

export default () => {
  const mockMotoToPost = {
    style: faker.lorem.words(2),
    year: faker.random.number(4),
  };
  return new Motorcycle(mockMotoToPost).save();
};
