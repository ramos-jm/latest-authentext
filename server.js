const express = require("express");
const axios = require('axios');
const multer = require('multer');
const path = require("path");
const FormData = require('form-data');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'AutthenTextAI-NEU/ATAI-Interface/Homepage')));
app.use('/homepage', express.static(path.join(__dirname, 'AutthenTextAI-NEU/ATAI-Interface/Homepage')));
app.use('/product', express.static(path.join(__dirname, 'AutthenTextAI-NEU/ATAI-Interface/Product')));
app.use('/atai-information', express.static(path.join(__dirname, 'AutthenTextAI-NEU/ATAI-Interface/ATAI_Information')));

app.use(bodyParser.json());

app.post('/api/detect/detectText', async (req, res) => {
    try {
        const inputText = req.body.input_text;
        const apiKey = "14b71190-ab93-4e5e-a23f-065f09544d42"; // Replace with your API key
        const apiUrl = "https://api.zerogpt.com/api/detect/detectText";

        const fetch = await import('node-fetch').then(mod => mod.default);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ApiKey': apiKey
            },
            body: JSON.stringify({ input_text: inputText })
        });
        
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/detect/detectFile', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = req.file.buffer; // Get file buffer data

    const url = "https://api.zerogpt.com/api/detect/detectFile";
    const data = new FormData();
    data.append('file', fileData, req.file.originalname); // Correctly append buffer with original file name

    const headers = {
        'ApiKey': '14b71190-ab93-4e5e-a23f-065f09544d42',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxODkzIiwicm9sZSI6IjMiLCJzYWxhdGFfZW5naW5lIjoiMi43IiwiY29zdF9wZXJfdGhvdXNhbmQiOiIwLjA2OSIsIm51bWJlcl9vZl9jaGFyYWN0ZXJzIjoiNTAwMDAwIiwibnVtYmVyX29mX2ZpbGVzIjoiMTUwIiwiZXhwIjoxNzQ3NDE5MDY4fQ.artQqU2hZ_he8jYcCBi8AB-jBkfS0o38X4jEDMzprc-x8PH6dfzTAwViUnT6z2CUjkri-N4o7YDIEaCR_4_-7FjKhJQVQ3La-ha1L96T0doRprLDLX-d4KkpNYhmCr1KRaL-DeG5wbecCAkx1_AjoQHM_xl2Q3CkXYh6YeGC1Q8',
        ...data.getHeaders()
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log(response.data);
        res.send(response.data);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
