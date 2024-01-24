const express = require('express');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3000;
const dataFilePath = 'db.json';

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // You can replace '*' with the specific domain you want to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Read all comments
app.get('/comments', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const comments = jsonData.comments;
    res.json(comments);
  } catch (error) {
    console.error('Error in /comments route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get spesific comments
app.get('/comments/:id', async (req, res) => {
  const commentId = parseInt(req.params.id);
  if (isNaN(commentId)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }
  
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const comment = jsonData.comments.find((p) => p.id === commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    console.error('Error in /comment/:id route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new comment
app.post('/comments', async (req, res) => {
  const newComment = req.body;

  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const newCommentId = jsonData.comments.length > 0 ? jsonData.comments[jsonData.comments.length - 1].id + 1 : 1;

    newComment.id = newCommentId;
    jsonData.comments.push(newComment);

    await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error in /comments route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
