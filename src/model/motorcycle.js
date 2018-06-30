'use strict';

import mongoose from 'mongoose';

const motorcycleSchema = mongoose.Schema({
  style: {
    type: String,
    required: true,
    unique: true,
  },
  version: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'version',
    },
  ],
  year: {
    type: Number,
  },
}, { timestamps: true });

motorcycleSchema.pre('findOne', function preHookCallback(done) {
  this.populate('version');
  done();
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('motorcycle', motorcycleSchema, 'motorcycle', skipInit);
