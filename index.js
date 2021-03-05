const express = require("express");
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postRoute = require("./PrivateRoute/Posts");
//Initializing express
const app = express();
app.use(express.json());

//puts/hides password when hosted
dotenv.config();

//Connecting with our db
mongoose.connect(
	process.env.DB_CONNECT,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => console.log("connected to database")
);

//Middlewares with authRoute as parameter
app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(7000, () => {
	console.log("server is running excellently well");
});
