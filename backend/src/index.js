import express from "express";
import mongoose from "mongoose";
import {loginValidation, registerValidation} from "../validations/auth.js";
import checkAuth from "../utils/checkAuth.js";
import {postValidation} from "../validations/post.js";
import multer from "multer";
import handleValidationErrors from "../utils/handleValidationErrors.js";
import {PostController, UserController} from "../controllers/index.js";
import * as dotenv from 'dotenv'
import cors from "cors";
import {getAllPopular} from "../controllers/PostController.js";

dotenv.config()


mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log(`DB connected `)
}).catch(err => {
  console.error(err)
})

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/tags', PostController.getLastTags)
app.get('/tags/:tag', PostController.getAllByTag)
app.get('/posts', PostController.getAll)
app.get('/popular', PostController.getAllPopular)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postValidation, handleValidationErrors, PostController.update)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`
  })
})

app.listen(4444, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log('server started')
})
