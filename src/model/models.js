'use strict';

import mongoose from 'mongoose';
import Motorcycle from './moto-builder';

const modelsSchema = mongoose.Schema({
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
    required: true,
  },
  transmission: {
    stype: String,
    required: true,
  },
  styleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'motorcycles',
  },
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('models', modelsSchema, 'models', skipInit);

function modelsPreHook(done) {
  return Motorcycle.findById(this.styleId)
    .then((foundMotorcycle) => {
      foundMotorcycle.models.push(this._id);
      return foundMotorcycle.save();
    })
    .then(() => done())
    .catch(done);
}
  
const modelsPostHook = (document, done) => {
  return Motorcycle.findById(document.styleId)
    .then((foundMotorcycle) => {
      foundMotorcycle.models = foundMotorcycle.models.filter(model => model._id.toString() !== document._id.toString());
      return foundMotorcycle.save();
    })
    .then(() => done())
    .catch(done);
};
  
modelsSchema.pre('save', modelsPreHook);
modelsSchema.post('remove', modelsPostHook);
