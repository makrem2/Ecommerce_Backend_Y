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

const db = require('./app/models');

db.sequelize.sync();


app.get("/",(req,res)=>{
  res.json({message:'Welcome to Our Ecommerce Application'});
});


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/categorie.routes')(app);
require('./app/routes/produit.routes')(app);
require('./app/routes/panier.routes')(app);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
