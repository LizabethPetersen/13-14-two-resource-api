'use strict';

import mongoose from 'mongoose';

const motorcycleSchema = mongoose.Schema({
  style: {
    type: String,
    required: true,
  },
  model: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'models',
    },
  ],
  year: {
    type: Number,
    default: 2018,
  },
}, { timestamps: true });

motorcycleSchema.pre('findOne', function preHookCallback(done) {
  this.populate('models');
  done();
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('motorcycles', motorcycleSchema, 'motorcycles', skipInit);
