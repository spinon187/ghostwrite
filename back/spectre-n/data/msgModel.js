import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const msgModel = new Schema({
  from: {type: String},
  to: {type: String},
  msg: {type: String},
})
export default mongoose.model('msg', msgModel)