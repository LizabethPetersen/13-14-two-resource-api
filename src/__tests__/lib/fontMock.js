'use strict';

import faker from 'faker';
import Font from '../../model/font';
import typefaceMockPromise from './typefaceMock';

export default () => {
    const mockData = {};
    return typefaceMockPromise()
    .then((newTypeface) => {
        mockData.typeface = newTypeface;
    })
    .then(() => {
        const mockFont = {
            family: faker.lorem.word(1),
            style: faker.lorem.word(1),
            typefaceId: mockData.lorem._id,
        };
        return new Font(mockFont).save();
    })
    .then((newFont) => {
        mockData.font = newFont;
        return mockData;
    })
    .catch((err) => {
        throw err;
    });
};