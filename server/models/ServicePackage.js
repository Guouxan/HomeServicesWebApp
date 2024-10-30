const mongoose = require('mongoose');

const ServicePackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  services: [{
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    quantity: { type: Number, default: 1 }
  }],
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Percentage discount
  duration: { type: Number, required: true }, // Total duration in minutes
  availableDates: [Date],
  covidRestrictions: { type: String, default: 'None' }
});

module.exports = mongoose.model('ServicePackage', ServicePackageSchema); 