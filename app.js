var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var actionsRouter = require("./routes/actions");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/actions", actionsRouter);

global.token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6ImEyZmE3NDg1LTViMWUtNDBiNC1iZTVhLWM0ZmY2NGE2ODY3NSIsImV4cCI6MTU3MTUxNzIxNCwiaWF0IjoxNTcxNTEzNjE0fQ.JdTjgptvJbxiTHBDITylaxEfuGSMdOUL2pkPfxI8dRU";

module.exports = app;
