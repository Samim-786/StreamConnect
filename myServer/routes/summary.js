const express = require('express');
const multer = require('multer');
const fs = require('fs');
const OpenAI = require("openai");
require('dotenv').config();

const router = express.Router();

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });



// pass your key when you create the client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// POST /api/summary/audio
router.post('/audio', upload.single('audio'), async (req, res) => {
     if (!req.file) return res.status(400).json({ error: "No file uploaded" });
     const audioPath = req.file.path;
     console.log("📁 Uploaded file path:", audioPath);
  try {

   const transcription = await openai.audio.transcriptions.create({
      file:  fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    const transcript = transcription.text;
    console.log("📝 Transcript:", transcript);

    // Step 2: Summarize with ChatGPT
      const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a meeting summarizer." },
        { role: "user",   content: `Summarize this transcript:\n\n${transcript}` },
      ],
    });

    const summary = completion.data.choices[0].message.content;

    // Optional: clean up
    fs.unlinkSync(audioPath);

    res.json({ transcript, summary });
  } catch (err) {
     fs.unlink(audioPath, () => {}); 
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to transcribe or summarize audio' });
  }
});

module.exports = router;
