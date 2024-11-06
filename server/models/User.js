const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  citizenship: { type: String, required: true },
  preferredLanguage: { 
    type: String, 
    required: true,
    enum: ['English', 'Mandarin', 'Hindi', 'Spanish', 'Arabic']
  },
  covidVaccinated: { 
    type: String, 
    required: true,
    enum: ['Yes', 'No', 'Prefer not to say']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: String, required: true }
  },
  googleId: String,
  facebookId: String,
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
