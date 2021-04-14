import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: String,
  age: Number,
});

export default mongoose.model('Author', authorSchema);