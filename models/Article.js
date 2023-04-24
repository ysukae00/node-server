// Schema
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  title: {
    type: String,
  },
  tag: {
    type: String
  },
  status: {
    type: String
  }
}, { timestamps: true })

const Article = mongoose.model('Article', articleSchema);
export default Article;