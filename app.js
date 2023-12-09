const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

const app = express();
app.use(cookieParser());
dotenv.config();

// connect to database
connectDB();

app.use(express.json());

const corsOptions = {
  // set origin to a specific origin.
  // origin: "http://localhost:3000",

  // or, set origin to true to reflect the request origin
  origin: true,

  credentials: true,
  sameSite: "None",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  res.json({ message: "Api is working" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
// app.use("/api/team", require("./routes/teamRoutes"));

// TODO: add topic endpoints
// app.use("/api/topic", require("./routes/topicRoutes"));

app.use(errorHandler);

module.exports = app;
