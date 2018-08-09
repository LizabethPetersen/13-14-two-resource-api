'use strict';

import mongoose from 'mongoose';

/*
SQL
CREATE DATABASE motorcycleDB;

CREATE TABLE motorcycles (
  motorcycleID PRIMARY SERIAL KEY,
  name VARCHAR(100) NOT NULL ,
  year INT,
  specsID INT,
  FOREIGN KEY (specsID) REFERENCES specs(specsID),
  date_added TIMESTAMP DEFAULT NULL,
);
*/


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
