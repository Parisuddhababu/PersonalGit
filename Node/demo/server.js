const express = require("express");

const app = express();

app.listen(4500, () => {
  console.log("server started");
});

app.get("/get-demo", (req, res) => {
  res.send("hello got request");
});

app.post("/create-demo", (req, res) => {
  res.send("hello post request");
});
app.put("/update-demo", (req, res) => {
  res.send("hello put request");
});
app.delete("/delete-demo", (req, res) => {
  res.send("hello delete request");
});
app.get("/get-demo-name", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/hello", (req, res) => {
  if (req.query.city) {
    res.send(`hello welcome to ${req.query.city} `);
  } else {
    res.send("welcome ");
  }
});
