const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const User = require('../models/user');
const mongoose = require('mongoose');
// ✅ Create new meeting
router.post('/create', async (req, res) => {
  const { title, roomName, createdBy } = req.body;

  if (!roomName || !createdBy) {
    return res.status(400).json({ error: 'Missing roomName or createdBy' });
  }

  try {
    const creatorId = new mongoose.Types.ObjectId(createdBy);
   const newMeeting = new Meeting({
  roomName,
  title,
  createdBy: creatorId,
  createdAt: new Date(),
});
    await newMeeting.save();
    res.status(201).json({ roomName });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create meeting', details: err.message });
  }
});

router.get('/past/:userId', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const email = user.email;

    const meetings = await Meeting.find({
      $or: [
        { createdBy: userId },
        { 'participants.email': email }
      ]
    }).sort({ createdAt: -1 });

    // Add role field: 'creator' or 'participant'
    const pastMeetings = meetings.map((meeting) => {
      const role =
        meeting.createdBy.toString() === userId.toString()
          ? 'creator'
          : 'participant';

      return {
        _id: meeting._id,
        roomName: meeting.roomName,
        createdAt: meeting.createdAt,
        role,
      };
    });

    res.json(pastMeetings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch past meetings', details: err.message });
  }
});

module.exports = router;
