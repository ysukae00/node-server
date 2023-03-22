import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'

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

app.use(cors('*'))

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
  posts.push({
    id: posts.length + 1,
    createdAt: new Date(),
    ...req.body
  });

  res.status(201).send("Create")
})

app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  // posts = [ {id: 1, ... }, { id: 2, ... } ]
  const post = posts.find(p => p.id === Number(postId));
  if (!post) {
    return res.status(204).json({
      data: "Content not found"
    })
  }
  res.status(200).json(post);
})

// Delete(DEL) - устгах
app.delete('/posts/:id', (req, res) => {
  const deleteId = req.params.id;
  console.log("Delete element id", deleteId);
  const deleteItemIndex = posts.findIndex(post => post.id === Number(deleteId));
  // [2, 3, 4]
  posts.splice(deleteItemIndex, 1);
  console.log(deleteItemIndex)
  res.send('Delete')
})

// Update(PUT)  - шинэчлэх
app.put('/posts/:id', (req, res) => {
  res.send('Update')
})

// GET /name ->

// listen -> app port дээр асааах
app.listen(8000, () => {
  console.log('App listening on port 8000');
});
