//to connect mongodb
const mongoose = require("mongoose");
require("dotenv").config();
const password = process.env.MONGO_DB_PASSWORD;
const mongoURL = `mongodb+srv://photo_app:${password}@clusterphotoapp.bv3sp.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const InitiateMongoServer = async () => {
  try {
    mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on("connected", () => {
      console.log("connected to mongodb");
    });
  } catch {
    mongoose.connection.on("Error", (err) => {
      console.log("error", err);
    });
  }
};
module.exports = InitiateMongoServer;
