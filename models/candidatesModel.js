const mongoose = require('mongoose');
const validator = require('validator');

const benefitsSchema = new mongoose.Schema({
  vr: { type: Number, default: 0 },
  va: { type: Number, default: 0 },
  pm: { type: Boolean, default: false },
  cursos: { type: Boolean, default: false },
  other: { type: String, default: '' }
});

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a least one name'],
      trim: true
    },
    phone: {
      type: String,
      minlength: [14, 'The phone number must have this format (00) 0000-0000'],
      trim: true
    },
    mobile: {
      type: String,
      minlength: [
        15,
        'The mobile number must have hits format (00) 0.0000-0000'
      ],
      trim: true,
      required: [true, 'Please provide a mobile number']
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      trim: true,
      validate: [validator.isEmail, 'This email is not valid try again']
    },
    tech: {
      type: String,
      trim: true,
      required: true
    },
    obs: {
      type: String,
      trim: true
    },
    lastSalary: {
      type: Number,
      required: true
    },
    benefits: benefitsSchema,
    createdBy: String
  },
  { timestamps: true }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
