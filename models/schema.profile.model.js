module.exports = (mongo) => {
  let model
  try {
    model = mongo.model('user_profiles');
  }catch{
    const Schema = mongo.Schema;
    const modelProfile = new Schema({
      id: {
        type: String,
        required: true,
        index: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });
    model = mongo.model('user_profiles', modelProfile);
  }
  return model;
};