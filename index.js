const mongoose = require("mongoose");
const express = require("express");
let app = express();
const config = require("./app");
const dotenv = require("dotenv").config();

app = config(app);
// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to database: " + err);
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port: " + server.address().port);
});
