import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpload = async () => {
    if (!file) return alert('Select a file first!');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      alert('Upload successful! File URL: ' + res.data.filePath);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Image Uploader</h2>
      <input type="file" onChange={handleChange} />
      {preview && <div><img src={preview} alt="preview" width="200" /></div>}
      <button onClick={handleUpload} style={{ marginTop: '10px' }}>Upload</button>
    </div>
  );
};

export default ImageUpload;
