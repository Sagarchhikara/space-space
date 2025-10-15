const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(cors());

// --- YOLO model endpoint (change this to your model's URL) ---
const MODEL_API_URL = process.env.MODEL_API_URL || 'http://localhost:8000/predict';

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// --- Route: Upload + Predict ---
app.post('/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    // Prepare form data for model
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));

    // Send image to YOLO model server
    const response = await axios.post(MODEL_API_URL, formData, {
      headers: formData.getHeaders(),
    });

    // Remove uploaded file after use
    fs.unlinkSync(req.file.path);

    // Return model response to frontend
    res.json({
      success: true,
      predictions: response.data,
    });
  } catch (error) {
    console.error('Error sending image to model:', error.message);
    res.status(500).json({ success: false, error: 'Prediction failed.' });
  }
});

// --- Start server ---
app.listen(5000, () => console.log('✅ Backend running on http://localhost:5000'));
