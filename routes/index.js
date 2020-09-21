//importing dependencies
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const apicache = require("apicache");
// const cache = apicache.middleware;
const mongoose = require("mongoose");
const User = require("../db/model/user.model");
const auth = require("../middleware/auth");
const password = "q6kXIvlvEXQsQzrw";
const mongoURL = `mongodb+srv://photo_app:${password}@clusterphotoapp.bv3sp.mongodb.net/<dbname>?retryWrites=true&w=majority`;
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});
mongoose.connection.on("Error", (err) => {
  console.log("error", err);
});
require("../db/model/user.model");

// route to handle "api/ping"

//router to test
router.get("/ping", (req, res) => {
  res.status(200).json({
    success: "true",
  });
});

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/register",
  [
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password, address, upload } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new User({
        username,
        email,
        password,
        address,
        upload,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

//client object
// router.post("/register", (req, res) => {
//   console.log("req.body", req.body);
//   let user = new User(req.body);
//   user
//     .save()
//     .then((user) => {
//       res.status(200).json({ user: "new user added successfully" });
//     })
//     .catch((err) => {
//       res.status(400).send("adding use failed");
//     });
// });
router.get("/users", (req, res) => {
  User.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const { username, address, image } = await User.findById(req.user.id);
    const dataToClient = await { username, address, image };
    res.json(dataToClient);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

module.exports = router;
