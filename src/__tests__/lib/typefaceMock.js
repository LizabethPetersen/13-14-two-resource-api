'use strict';

import faker from 'faker';
import Typeface from '../../model/typeface';


export default () => {
    const typefaceMockPromise = {
      name: faker.lorem.words(5),
      style: faker.lorem.words(3),
      designer: faker.lorem.words(2),
    };
    return new Typeface(typefaceMockPromise).save();
};