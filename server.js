const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes and origins
app.use(cors({
  origin: 'http://localhost:4200', // Allow requests from your Angular frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Allow specific headers
}));

// Your routes go here
app.listen(8081, () => {
  console.log('Backend running on http://localhost:8081');
});

app.listen(8082, () => {
  console.log('Backend running on http://localhost:8081');
});
