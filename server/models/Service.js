const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  availableDates: [Date],
  covidRestrictions: { type: String, default: 'None' }
});

module.exports = mongoose.model('Service', ServiceSchema);
