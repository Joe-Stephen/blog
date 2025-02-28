const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  events.push(event);
  const eventEndpoints = [
    "http://posts-clusterip-srv:4000/events", // posts
    // "http://localhost:4001/events", // comments
    // "http://localhost:4002/events", // query
    // "http://localhost:4003/events", // moderation
  ];
  try {
    const results = await Promise.allSettled(
      eventEndpoints.map((url) => axios.post(url, event))
    );
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Error sending event to ${eventEndpoints[index]}:`,
          result.reason.message
        );
      }
    });
    res.send({ status: "OK" });
  } catch (error) {
    console.error("Unexpected error in /events POST API:", error);
    res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
  }
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Event bus listening on port 4005");
});
