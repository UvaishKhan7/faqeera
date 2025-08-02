const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// SUB-DOCUMENT SCHEMA FOR ADDRESSES
const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  phoneNumber: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

// MAIN USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please use a valid email address'] },
    password: { type: String },
    authProvider: { type: String, required: true, enum: ['credentials', 'google', 'apple'], default: 'credentials' },
    googleId: { type: String, unique: true, sparse: true },
    appleId: { type: String, unique: true, sparse: true },
    isAdmin: { type: Boolean, required: true, default: false },
    addresses: [addressSchema],
    phoneNumber: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// CONDITIONAL VALIDATION: Password is required only for 'credentials' auth
userSchema.path('password').required(function() {
    return this.authProvider === 'credentials' // Or other logic as needed
}, 'Password is required.');

// HELPER METHOD: To compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// MIDDLEWARE: Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;