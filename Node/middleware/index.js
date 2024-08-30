const express = require("express");
const app = express();

app.listen(4500, () => {
  console.log("server started");
});

app.get("/api", (req, res) => {
  res.send("hello");
});
app.get("/", (req, res) => {
  res.sendfile(__dirname + "/public/login.html");
});
app.use("/public", express.static(__dirname + "/public"));
