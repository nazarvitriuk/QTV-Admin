import mongoose from 'mongoose';

const MONGO_URI = `mongodb+srv://${ process.env.MONGO_USERNAME }:${ process.env.MONGO_PASSWORD }@cluster0.krejlc7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const OPTIONS_FILE_DB_ID = '678390947299868f3bd989ab';

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  avatar: {type: String, required: true},
  color: {type: String, required: true},
  id: {type: String, required: true},
})

const OptionsSchema = new mongoose.Schema({
  users: [UserSchema],
  chatEnabled: Boolean,
  stringEnabled: Boolean
})

const Options = mongoose.model('Options', OptionsSchema);

export default defineEventHandler(async (event) => {
  const mongooseConnect = await mongoose.connect(MONGO_URI, {});
  let data = null;

  if (event._method === 'GET') {
    data = await Options.findById(OPTIONS_FILE_DB_ID);
  }

  if (event._method === 'POST') {
    const reqBody = await readBody(event);

    data = await Options.findByIdAndUpdate('678390947299868f3bd989ab', {
      users: reqBody.users,
      chatEnabled: reqBody.chatEnabled,
      stringEnabled: reqBody.stringEnabled,
    })
  }

  return data

//
//     app.get('/', function(req, res) {
//       res.send('Welcome');
//     });
//
//     app.get('/options', (req, res) => {
//       Options.findById('678390947299868f3bd989ab')
//         .then(data => res.json(data))
//         .catch(err => res.send(err));
//     })
//
//     app.post('/options', (req, res) => {
//       Options.findByIdAndUpdate('678390947299868f3bd989ab', {
//         users: req.body.users,
//         chatEnabled: req.body.chatEnabled,
//         stringEnabled: req.body.stringEnabled,
//       })
//         .then((res) => console.log(res))
//         .catch(err => console.log(err));
//     })
//   }
});
