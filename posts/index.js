const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const posts = {};
app.get("/posts", (req, res) => {
  res.send(posts);
});
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };
  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });
  res.status(201).send(posts[id]);
});
app.post("/events", (req, res) => {
  console.log("Received event", req.body.type);
  res.send({ status: "OK" });
});
app.listen(4000, () => {
  console.log("v20 new version");
  console.log("Posts listening on port 4000");
});
