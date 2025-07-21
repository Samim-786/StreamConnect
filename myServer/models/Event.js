const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  scheduledTime: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [String], // email addresses
  reminderSent: { type: Boolean, default: false },
  summarySent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Event', eventSchema);
