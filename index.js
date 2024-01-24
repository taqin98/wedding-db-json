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


// Read all posts
app.get('/posts', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const posts = jsonData.posts;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read all comments
app.get('/comments', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const comments = jsonData.comments;
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read a single post
app.get('/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const post = jsonData.posts.find((p) => p.id === postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read comments for a specific post
app.get('/posts/:id/comments', async (req, res) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const comments = jsonData.comments.filter((c) => c.postId === postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new post
app.post('/posts', async (req, res) => {
  const newPost = req.body;

  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const newPostId = jsonData.posts.length > 0 ? jsonData.posts[jsonData.posts.length - 1].id + 1 : 1;

    newPost.id = newPostId;
    jsonData.posts.push(newPost);

    await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new comment for a specific post
app.post('/posts/:id/comments', async (req, res) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  const newComment = req.body;

  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const newCommentId = jsonData.comments.length > 0 ? jsonData.comments[jsonData.comments.length - 1].id + 1 : 1;

    newComment.id = newCommentId;
    newComment.postId = postId;
    jsonData.comments.push(newComment);

    await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ... (update and delete operations for posts and comments)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
