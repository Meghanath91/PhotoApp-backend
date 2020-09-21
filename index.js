//declaration of dependencies
const express = require("express");
const port = 8080;
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const bodyParser = require("body-parser");
//helmet is middleware for Http response headers
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
//middleware to setup cookie session in browser
//helmet is middleware for Http response headers

//middleware to parse the incoming request bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//middleware to setup cookie session in browser
//importing route
const route = require("./routes/index");
//to handle "/api routes"
app.use("/api", route);
app.listen(port, () => console.log(`server listening on ${port}`));
