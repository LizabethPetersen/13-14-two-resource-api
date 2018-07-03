'use strict';

import faker from 'faker';
import Motorcycle from '../../model/motorcycle';

// check naming conventions on this: why mockMotoResource? Isn't this the promise?
export default () => {
  const mockMotoResource = {
    name: faker.lorem.words(4),
  };
  return new Motorcycle(mockMotoResource).save();
};
