import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import mongoose from 'mongoose';
import User from './models/User.js';
import * as dotenv from 'dotenv'
import Article from './models/Article.js';

dotenv.config();

//  Db- руу хандах url
const MONGODB_URL = process.env.MONGO_DB_URL;

// MongoDB -  тай холбогдох хэсэг
async function connectDB() {
  await mongoose.connect(MONGODB_URL)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("Error", err))
}

// DB холбох
connectDB();

const posts = [
  {
    id: 1,
    createdAt: new Date("08.08.2021"),
    image: 'https://images.pexels.com/photos/2821728/pexels-photo-2821728.jpeg',
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
app.get('/posts', async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});

// Create(POST), - үүсгэх
app.post('/posts', async (req, res) => {
  const { image, title, description, tag } = req.body;

  const article = await Article.create({
    image, title, description, tag
  })

  res.status(201).json(article)
})

app.get("/posts/:id", async (req, res) => {
  const postId = req.params.id;
  // posts = [ {id: 1, ... }, { id: 2, ... } ]
  const article = await Article.findById(postId)
  res.status(200).json(article);
})

// Delete(DEL) - устгах
app.delete('/posts/:id', async (req, res) => {
  const deleteId = req.params.id;
  await Article.findByIdAndDelete(deleteId);
  res.send('Delete')
})

// Update(PUT)  - шинэчлэх
app.put('/posts/:id', (req, res) => {
  res.send('Update')
})

// GET /name ->

// POST /users {req.body} -> username, lastname
function check(req, res, next) {
  const { username, lastname } = req.body;
  if (!username || !lastname) {
    return res.status(404).json({
      error: 'Хэрэглэгчийн нэр эсвэл овог хоосон байна'
    })
  }
  next();
}
// Step 1
app.post('/users', check, async (req, res) => {
  // Step 2 body - oor orj irsen utga
  const { username, lastname, phoneNumber } = req.body;

  // if (!username || !lastname) {
  //   return res.status(404).json({
  //     error: 'Хэрэглэгчийн нэр эсвэл овог хоосон байна'
  //   })
  // }
  // console.log("Users", username, lastname)
  // Step 3 User table - ruu utga nemeh
  const user = await User.create({
    username,
    lastname,
    phoneNumber,
  });

  res.status(201).json({
    success: true,
    data: user
  })
})

// get all 
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users
  })
})

// get by id 
// GET '/users/:id' 
app.get('/users/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id)
    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({
        error: "Тухайн өгөгдөл олдсонгүэ!!"
      })
    }
    next()
  }
})

// DELETE '/users/:id'

app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  await User.findByIdAndDelete(id);

  res.status(200).json({
    msg: 'Deleted'
  })
});

// PUT '/users/:id' body -> { username:  }

app.put('/users/:id', async (req, res) => {
  const { lastname, username, phoneNumber } = req.body;
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, {
      lastname,
      username,
      phoneNumber
    }, { new: true })

    return res.status(200).json({
      success: true,
      data: user
    })
  } catch (err) {

  }
})



// listen -> app port дээр асааах
app.listen(8000, () => {
  console.log('App listening on port 8000');
});
