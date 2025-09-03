const express = require("express");
const cors = require("cors");

const app = express();

const path = require("path");

require('dotenv').config();


var corsOptions = {
  origin: ["http://localhost:4200"],
};

app.use(cors(corsOptions));

app.use("/Images", express.static("./Images"));
app.use(express.static(path.join(__dirname, "static")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
