const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(cors());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// --- YOLO model endpoint ---
const MODEL_API_URL = process.env.MODEL_API_URL || 'http://localhost:8000/predict/'; // trailing slash

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));

// --- Route: Upload + Predict (returns image) ---
app.post('/predict', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    // Forward to FastAPI
    const response = await axios.post(`${MODEL_API_URL}?return_image=true`, formData, {
      headers: formData.getHeaders(),
    });

    // Remove local uploaded file
    fs.unlinkSync(req.file.path);

    // Return JSON from FastAPI as-is
    res.json(response.data);
  } catch (error) {
    console.error('Error sending image to model:', error.message, error.response?.data);
    res.status(500).json({ success: false, error: 'Prediction failed.' });
  }
});


// --- Start server ---
app.listen(5000, () => console.log('✅ Backend running on http://localhost:5000'));
