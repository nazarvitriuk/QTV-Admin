import mongoose from 'mongoose';

const MONGO_URI = `mongodb+srv://${ process.env.MONGO_USERNAME }:${ process.env.MONGO_PASSWORD }@cluster0.krejlc7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const OPTIONS_FILE_DB_ID = '67863cd7ca36d901ee798078';

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  avatar: {type: String, required: true},
  color: {type: String, required: true},
  id: {type: String, required: true},
  nickname: {type: String, required: true},
})

const OptionsSchema = new mongoose.Schema({
  users: [UserSchema],
  chatEnabled: Boolean,
  stringEnabled: Boolean
})

const Options = mongoose.model('Options', OptionsSchema);

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*');
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');

  const mongooseConnect = await mongoose.connect(MONGO_URI, {});
  let data = null;

  if (event._method === 'GET') {
    data = await Options.findById(OPTIONS_FILE_DB_ID);
  }

  if (event._method === 'POST') {
    const reqBody = await readBody(event);

    data = await Options.findByIdAndUpdate(OPTIONS_FILE_DB_ID, {
      users: reqBody.users,
      chatEnabled: reqBody.chatEnabled,
      stringEnabled: reqBody.stringEnabled,
    })

    return data;
  }

  return data
});
