//declaration of dependencies
const express = require("express");
const port = 8080;
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./db/index");

// Initiate Mongo Server
InitiateMongoServer();

require("dotenv/config");
//helmet is middleware for Http response headers
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

//middleware to parse the incoming request bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//importing route
const route = require("./routes/index");

//to handle "/api routes"
app.use("/api", route);
// app.use("/api", photosRouter);
app.listen(port, () => console.log(`server listening on ${port}`));
