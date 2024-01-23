// server.js
const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve the JSON data
app.use('/api', jsonServer.router(path.join(__dirname, 'db.json')));

// Start the server
app.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
