import express from 'express';

const posts = [
  {
    userId: 10,
    name: 99,
    title: 'temporibus sit alias delectus eligendi possimus magni',
  },
  {
    userId: 1,
    id: 98,
    title: 'temporibus sit alias delectus eligendi possimus magni',
  },
];

// APP үүсгэх
const app = express();

// '/' -> localhost:8000/
app.get('/', (req, res) => {
  res.send('Hello Server..');
});

// CRUD -
// Read(GET),  - унших
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Create(POST), - үүсгэх
app.post('/posts', (req, res) => {
  res.send('Create')
})

// Delete(DEL) - устгах
app.del('/posts', (req, res) => {
  res.send('Delete')
})

// Update(PUT)  - шинэчлэх
app.put('/posts', (req, res) => {
  res.send('Update')
})

// GET /name ->

// listen -> app port дээр асааах
app.listen(8000, () => {
  console.log('App listening on port 8000');
});
