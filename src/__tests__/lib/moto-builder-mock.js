'use strict';

import faker from 'faker';
import Motorcycle from '../../model/motoBuilder';


export default () => {
    const mockMotoPromise = {
      model: faker.lorem.words(2),
      style: faker.lorem.words(5),
    };
    return new Motorcycle(mockMotoPromise).save();
};