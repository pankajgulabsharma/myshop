const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

/*CONFIGURATION*/
require("dotenv").config();

/*USING MIDDLEWARE*/
app.use(morgan("tiny"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//cors
app.use(cors());
app.options("*", cors()); //anyone can access
//cookie-parser
app.use(cookieParser());
// with the help of multer package we r creating images link during creation of product but
// when we put that link into the browser we r getting->   Cannot GET /public/uploads/PAN-card-1678048384532.jpeg
// to resolve this issue he have to make /public/uploads folder as a static folder to do that
// here express.static make folder static(not related to API) so that any one can see by clicking on link 
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "/public/uploads"))
);

/* MONGOOSE SETUP*/
const PORT = process.env.PORT || 9000;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running on port http://localhost:${PORT}`); //Listening on port 8888
    });
  })
  .catch((error) => console.log(`Server Error : ${error}`));

/*IMPORTING ROUTES*/
const productRoutes = require("./routes/product.js");
const categoryRoutes = require("./routes/categories.js");
const userRouters = require("./routes/user.js");
const orderRouters = require("./routes/orders.js");
const orderItemsRouters = require("./routes/orderItems.js");

/*USING ROUTES*/
app.use(`${process.env.API_URL}/product`, productRoutes);
app.use(`${process.env.API_URL}/category`, categoryRoutes);
app.use(`${process.env.API_URL}/user`, userRouters);
app.use(`${process.env.API_URL}/order`, orderRouters);
app.use(`${process.env.API_URL}/orderitems`, orderRouters);

// app.get("/", (req, res) => {
//   res.send("HI PANKAJ");
// });

// app.post("/post", (req, res) => {
//   let bodyData = req.body;
//   console.log("bodyData==>", bodyData);
//   res.send(bodyData);
// });
