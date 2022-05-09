module.exports = (mongo) => {
  let model
  try {
    model = mongo.model('user_logins')
  }catch{
    const Schema = mongo.Schema;
    const modelLogin = new Schema({
      id_user_profiles: {
        type: String,
        required: true,
        index: true,
        ref: 'user_profiles',
      },
      username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: Number,
        required: true,
        default: 2,
      },
    });
    model = mongo.model('user_logins', modelLogin);
  }
  return model;
};