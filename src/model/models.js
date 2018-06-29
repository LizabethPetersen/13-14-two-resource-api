'use strict';

import mongoose from 'mongoose';
import Motorcycle from './motorcycle';

const modelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cc: {
    type: String,
    required: true,
  },
  engine: {
    type: String,
  },
  transmission: {
    stype: String,
  },
  styleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'motorcycles',
  },
}, { timestamps: true });

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('models', modelSchema, 'models', skipInit);

function modelPreHook(done) {
  return Motorcycle.findById(this.styleId)
    .then((foundMotorcycle) => {
      foundMotorcycle.models.push(this._id);
      return foundMotorcycle.save();
    })
    .then(() => done())
    .catch(done);
}
  
const modelPostHook = (document, done) => {
  return Motorcycle.findById(document.styleId)
    .then((foundMotorcycle) => {
      foundMotorcycle.models = foundMotorcycle.models.filter(model => model._id.toString() !== document._id.toString());
      return foundMotorcycle.save();
    })
    .then(() => done())
    .catch(done);
};
  
modelSchema.pre('save', modelPreHook);
modelSchema.post('remove', modelPostHook);
