// server.js
const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Use json-server middleware
const jsonServerMiddleware = jsonServer.router('db.json');
app.use('/api', jsonServerMiddleware);

// Create API routes
app.get('/users', (req, res) => {
  // Handle GET request for /api/users
  // Add your logic here

  // Example HTML output
  const htmlOutput = "<h1>Hello, API Users!</h1>";
  res.send(htmlOutput);
});

// Serve static files (optional)
// app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
