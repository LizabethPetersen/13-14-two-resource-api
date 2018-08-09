'use strict';

import mongoose from 'mongoose';
import Motorcycle from './motorcycle';
/*
SQL

CREATE TABLE specs (
  specsID FOREIGN KEY,  // is this how this would be written in this table, or is specsID also a primary serial key?
  style VARCHAR(25),
  cc INT,
  engine VARCHAR(25),
  transmission VARCHAR(25),
);

*/


const specsSchema = mongoose.Schema({
  style: {
    type: String,
    // enum: ['H2', Supersport', 'Sport', 'Standard', 'Touring', 'Dual-sport', 'Cruiser', 'Off-road'],
    required: true,
  },
  cc: {
    type: Number,
    required: true,
  },
  engine: {
    type: String,
  },
  transmission: {
    type: String,
  },
  motorcycleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'motorcycle',
  },
}, { timestamps: true });

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('specs', specsSchema, 'specs', skipInit);

function specsPreHook(done) {
  return Motorcycle.findById(this.motorcycleId)
    .then((foundMotorcycle) => {
      foundMotorcycle.specs.push(this._id);
      return foundMotorcycle.save();
    })
    .then(() => done())
    .catch(done);
}

const specsPostHook = (document, done) => {
  return Motorcycle.findById(document.motorcycleId)
    .then((foundMotorcycle) => {
      foundMotorcycle.specs = foundMotorcycle.specs.filter(specs => specs._id.toString() !== document._id.toString());
      return foundMotorcycle.save();
    })
    .then(() => done())
    .catch(done);
};

specsSchema.pre('save', specsPreHook);
specsSchema.post('remove', specsPostHook);
