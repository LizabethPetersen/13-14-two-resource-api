'use strict';

import faker from 'faker';
import Motorcycle from '../../model/moto-builder';

export default () => {
    const mockMotoPromise = {
      style: faker.lorem.words(2),
      year: faker.random.number(4),
    };
    return new Motorcycle(mockMotoPromise).save();
};