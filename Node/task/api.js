const express = require("express");
const app = express();

app.listen(6000, (req, res) => {
  console.log("server started");
});

app.get("/mobiles", (req, res) => {
  res.send("get mobile");
});
app.post("/mobiles", (req, res) => {
  res.send("create mobiles");
});
app.put("/mobiles", (req, res) => {
  res.send("update mobiles");
});
app.delete("/mobiles", (req, res) => {
  res.send("delete mobiles");
});
