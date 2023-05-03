require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT;
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));

//Models
const User = require("./models/User");

//Config json responde
app.use(express.json());

//Variável do .env
const dbUser = process.env.DB_CONNECT;

mongoose.connect(dbUser, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Registrando usuário
app.post("/auth/register", async (req, res) => {
  //Desestruturação
  const { name, email, password, confirmpassword } = req.body;

  //Validações
  if (!name) {
    return res.status(422).json({ message: "Field name is required!" });
  }
  if (!email) {
    return res.status(422).json({ message: "Field email is required!" });
  }
  if (!password) {
    return res.status(422).json({ message: "Field password is required!" });
  }
  if (password != confirmpassword) {
    return res.status(422).json({ message: "Password must be equals" });
  }

  //Check if users exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ message: "Please, use another email" });
  }

  //Create password

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //Create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error occurred creating user, try again later" });
  }
});

//Login user
app.post("/auth/user", async (req, res) => {
  const { email, password } = req.body;

  //validations

  if (!email) {
    return res.status(422).json({ message: "Field email is required!" });
  }
  if (!password) {
    return res.status(422).json({ message: "Field password is required!" });
  }

  //Check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "Email not found!" });
  }

  //Check if password matches

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(404).json({ message: "Password does not match!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Authentication successful", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error occurred creating user, try again later" });
  }
});

//Public Route
app.get("/", (req, res) => {
  res.render('index.ejs');
});

//Private Route
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  try {
    //check if user exists
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access denied" });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
