const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const { AccessToken } = require("livekit-server-sdk");
require('dotenv').config();
const Meeting = require('./models/Meeting');
const User = require('./models/user');
const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meeting');
const inviteRoutes = require('./routes/invite');
const eventRoutes = require('./routes/event');
const summaryRoute = require('./routes/summary');
const app = express();
const port =  process.env.PORT|| 4000;
require('./reminderScheduler')
app.use(cors());
app.use(express.json());

// ✅ Fix: Add routes BEFORE starting the server
app.get('/', (req, res) => {
  res.send('Backend is live 🎉');
});
app.use('/api/auth', authRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/send-invites', inviteRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/summary', summaryRoute);
app.get('/token', async (req, res) => {
  const { roomName, identity,userId } = req.query;

  if (!roomName || !identity || !userId) {
    return res.status(400).json({ error: 'Missing roomName or identity' });
  }

  try {
    const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {
      identity: String(identity),
      ttl: '1h',
    });

    at.addGrant({ 
      roomJoin: true,
      room: String(roomName),
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();
     const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
      await Meeting.findOneAndUpdate(
      { roomName },
      {
        $addToSet: {
          participants: {
            email: user.email,
            joinedAt: new Date(),
          },
        },
      }
    );
    return res.json({ token });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate token', details: err.message });
  }
});


// ✅ Now connect to MongoDB and then start server
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch(err => console.log("MongoDB connection error:", err));
