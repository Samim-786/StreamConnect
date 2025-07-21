const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  roomName: { type: String, required: true, unique: true },
  title: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledAt: Date,
  participants: [
    {
      email: String,
      joinedAt: Date,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
