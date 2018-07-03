'use strict';

import mongoose from 'mongoose';

const motorcycleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  year: {
    type: String,
    required: true,
  },

  specs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'specs',
    },
  ],
}, { timestamps: true });

motorcycleSchema.pre('findOne', function preHookCallback(done) {
  this.populate('specs');
  done();
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('motorcycle', motorcycleSchema, 'motorcycle', skipInit);
