const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false, // Make email optional if you're allowing OAuth without an email
    unique: true,
    sparse: true, // Allows for null values in the unique index
  },
  password: {
    type: String,
    required: false, // Make password optional for OAuth users
  },
  googleId: {
    type: String,
    required: false, // Only required for users logging in with Google
    unique: true,
    sparse: true, // Allows for null values in the unique index
  },
  displayName: String, // Consider storing names for a personalized experience
  // Add other fields as necessary, such as profile pictures, etc.
});

// Pre-save hook to hash the password before saving the user document, if password is present
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to compare a given password with the hashed one, if password login is used
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false; // In case of OAuth users without a password
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
