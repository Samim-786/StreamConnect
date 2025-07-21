const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');   

// Create a new event
router.post('/', async (req, res) => {
  const { title, description,scheduledTime, createdBy, participants } = req.body;

  if (!title ||  !scheduledTime || !createdBy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const event = new Event({
      title,
      description,
      scheduledTime,
      createdBy,
      participants: participants || []
    });

    await event.save();
    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event', details: err.message });
  }
});

// Get all events for a user (both past and upcoming)
// GET /api/event/past/:userId
router.get('/past/:userId', async (req, res) => {
  try {
    const now = new Date();
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const pastEvents = await Event.find({
      createdBy: userId,
      scheduledTime: { $lt: now }
    }).sort({ scheduledTime: -1 });

    res.json(pastEvents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch past events', details: err.message });
  }
});

// GET /api/event/upcoming/:userId
router.get('/upcoming/:userId', async (req, res) => {
  try {
    const now = new Date();
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const upcomingEvents = await Event.find({
      createdBy: userId,
      scheduledTime: { $gte: now }
    }).sort({ scheduledTime: 1 });

    res.json(upcomingEvents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch upcoming events', details: err.message });
  }
});


module.exports = router;
