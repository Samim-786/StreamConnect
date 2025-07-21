// reminderScheduler.js
const mongoose   = require('mongoose');
const Event      = require('./models/Event');
const User       = require('./models/user');      // 👈 look‑up creator email
const nodemailer = require('nodemailer');

mongoose.connect(process.env.MONGO_URL);

/* ── mail transport ───────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/* ── main task ─────────────────────────────────── */
async function sendReminders() {
  const now        = new Date();
  const lowerBound = new Date(now.getTime() + 30 * 60 * 1000); // ≥ 30 min
  const upperBound = new Date(now.getTime() + 60 * 60 * 1000); // ≤ 60 min

  const events = await Event.find({
    scheduledTime: { $gte: lowerBound, $lte: upperBound },
    reminderSent : false,
  });

  for (const ev of events) {
    /* 1️⃣  get creator’s email */
    const creator = await User.findById(ev.createdBy, 'email');
    if (!creator) continue;                       // skip if user gone

    /* 2️⃣  build recipient list (creator + participants) */
    const recipientsSet = new Set(ev.participants); // may be empty
    recipientsSet.add(creator.email);               // always include creator
    const recipients = [...recipientsSet].join(',');

    /* 3️⃣  compose email */
    const when = new Date(ev.scheduledTime).toLocaleString();
    const mail = {
      from   : process.env.GMAIL_USER,
      to     : recipients,
      subject: `⏰ Reminder: ${ev.title}`,
      text   : `Friendly reminder: "${ev.title}" is scheduled for ${when}.`,
    };

    /* 4️⃣  send & mark */
    try {
      await transporter.sendMail(mail);
      ev.reminderSent = true;
      await ev.save();
      console.log('✅ reminder sent for', ev.title);
    } catch (err) {
      console.error('✖ reminder failed for', ev.title, err.message);
    }
  }
}

/* ── run every 5 min ──────────────────────────── */
setInterval(sendReminders, 5 * 60 * 1000);
console.log('🔔 Reminder scheduler running (every 5 min)');
