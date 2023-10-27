const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

const app = express();
dotenv.config();

// connect to database
connectDB();

app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Api is working" });
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
