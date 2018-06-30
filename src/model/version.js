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
    ref: 'motorcycle',
  },
}, { timestamps: true });

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('version', modelSchema, 'version', skipInit);

function versionPreHook(done) {
  return Motorcycle.findById(this.styleId)
    .then((foundMotorcycle) => {
      console.log(foundMotorcycle, 'thisdg;kalhfgaldk;gjadfgl;k');
      foundMotorcycle.version.push(this._id);
      return foundMotorcycle.save();
    })
    .then(() => done())
    .catch(done);
}
  
const versionPostHook = (document, done) => {
  return Motorcycle.findById(document.styleId)
    .then((foundMotorcycle) => {
      foundMotorcycle.version = foundMotorcycle.version.filter(version => version._id.toString() !== document._id.toString());
      return foundMotorcycle.save();
    })
    .then(() => done())
    .catch(done);
};
  
modelSchema.pre('save', versionPreHook);
modelSchema.post('remove', versionPostHook);
