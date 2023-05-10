import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import mongoose from 'mongoose';
import User from './models/User.js';
import * as dotenv from 'dotenv'
import Article from './models/Article.js';
import Banner from './models/Banner.js';
import jwt from 'jsonwebtoken';

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
  // 1, status 
  const { image, title, description, tag, status } = req.body;

  // 2. status
  const article = await Article.create({
    image, title, description, tag, status
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
app.put('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findByIdAndUpdate(id, req.body, { new: true })

    return res.status(200).json(article)
  } catch (error) {

  }
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
  const { username, lastname, phoneNumber, password } = req.body;

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
    password,
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

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).select("+password");
  // 1. username - tei hereglech bnuuu
  if (!user) {
    return res.status(400).json({
      msg: "Хэрэглэгчийн нэр эсвэл нууц үг буруу"
    })
  }
  // 2. password unen bnuu 
  if (String(password) !== user.password) {
    return res.status(400).json({
      msg: "Хэрэглэгчийн нэр эсвэл нууц үг буруу"
    })
  }


  return res.status(200).json({
    token: jwt.sign({
      id: user.id,
      username: user.username,
    }, 'blablaa', { expiresIn: '30d' })
  })
  // 3. res -> amjilttai 
});

app.get("/banners", async (rep, res) => {
  const banner = await Banner.find();
  res.status(200).json(banner)
});

app.get("/banners/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const banner = await Banner.findById(id);
    res.status(200).json(banner)
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({
        error: "Tuhain ogogdol oldsonguie"
      })
    }
    next();
  }
});

app.post('/banners', async (req, res) => {
  // Step 2 body - oor orj irsen utga
  const { image, description, title } = req.body;

  const banner = await Banner.create({
    image,
    description,
    title
  })
  res.status(201).json({
    success: true,
    data: banner
  })
});

app.delete('/banners/:id', async (req, res) => {
  const id = req.params.id;
  await Banner.findByIdAndDelete(id);

  res.status(200).json({
    msg: 'Deleted'
  })
});

app.put('/banners/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await Banner.findByIdAndUpdate(id, req.body, {
      title,
      image,
      description
    }, { new: true })

    return res.status(200).json({
      success: true,
      data: banner
    })
  } catch (error) {

  }
})

// listen -> app port дээр асааах
app.listen(8000, () => {
  console.log('App listening on port 8000');
});
