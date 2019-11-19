const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
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
    minlength: [15, 'The mobile number must have hits format (00) 0.0000-0000'],
    trim: true,
    required: true
  },
  tech: {
    type: String,
    trim: true,
    required: true
  },
  obs: {
    type: String,
    trim: true,
    required: true
  },
  benefits: String
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
