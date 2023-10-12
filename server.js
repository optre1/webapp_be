
const express = require('express');
const mongo = require('mongodb').MongoClient
const app = express();
const db = new mongo(url: 'mongodb+srv://127.0.0.1', options: null)
const port = 5001;
app.use(express.json())
app.post('/api/login', (req, res) => {
const { username, password } = req.body;
  // Perform authentication logic here
  console.log('Received login request for Username:', username, 'Password:', password);
  // Send response back to the client
  res.json({ success: true, message: 'Login successful' });});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
