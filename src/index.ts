import { MongooseError } from "mongoose";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/cinemax-authentication", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose connected successfully!"))
  .catch((err: MongooseError) =>
    console.log("Could not connect mongoose: ", err)
  );

app.listen(3000, () => {
  console.log("App started!");
});
