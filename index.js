const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./config/mongodb/index");
//Sử dụng từ khoá use (app.use), express hiểu là sử dụng middleware => nên config middleware trước routes

//Require Routes
const authRouter = require("./routes/auth.routes");
const songRouter = require("./routes/song.routes");
const playlistRouter = require("./routes/playlist.routes");
const userRouter = require("./routes/user.routes");
const libraryRouter = require("./routes/library.routes");
const categoryRouter = require("./routes/category.routes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Connect db
db.connect();

//config cookie-parser
app.use(cookieParser());
//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Setup cors
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://sfotipy-frontend.vercel.app/", //Chan tat ca cac domain khac ngoai domain nay
    credentials: true, //Để bật cookie HTTP qua CORS
  })
);

//Setup routes
app.use("/api/library", libraryRouter);
app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);

app.get("/", (req, res) => {
  return res.send("API is running successfully");
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
