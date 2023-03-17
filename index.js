import express from 'express';
import bodyParser from 'body-parser';

const posts = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/2821728/pexels-photo-2821728.jpeg',
    createdAt: new Date("08.08.2021"),
    title: "Dream destinations to visit this year in Paris",
    description: "Progressively incentivize cooperative systems through technically sound functionalities.Credibly productivate seamless data with flexible schemas.",
    tag: 'ADVENTURE'
  }
];

// APP үүсгэх
const app = express();

// Body parser тохиргоо
app.use(bodyParser.json())

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
  // const { title }  = req.body
  posts.push({
    id: posts.length + 1,
    createdAt: new Date(),
    ...req.body
  });
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
