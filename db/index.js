//to connect mongodb
const password = "q6kXIvlvEXQsQzrw";
const mongoURL = `mongodb+srv://photo_app:${password}@clusterphotoapp.bv3sp.mongodb.net/<dbname>?retryWrites=true&w=majority`;
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});
mongoose.connection.on("Error", (err) => {
  console.log("error", err);
});
