var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const compression = require("compression");

const errorHandlers = require("./handlers/errorHandlers");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const discordRouter = require("./routes/discord");
const questionsRouter = require("./routes/questions");
const commentsRouter = require("./routes/comments");
const projectsRouter = require("./routes/projects");

var app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://challenge-board-react.vercel.app",
    ],
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/discord", discordRouter);
app.use("/questions", questionsRouter);
app.use("/comments", commentsRouter);
app.use("/projects", projectsRouter);

//error handlers

app.use(errorHandlers.notFound);
app.use(errorHandlers.sequelizeErrorHandler);

if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;
