const express = require("express");
const shortid = require("shortid");

const server = express();

let hubs = [];

// Middleware
server.use(express.json()); // teaches express how to parse JSON from the request body

// Endpoints

// introduce `routing` and explain how requests are routed to the correct
// `request handler function` based on the URL and HTTP verb on the request.
// Explain what `req` and `res` are.
server.get("/", (req, res) => {
  // name is not important (could be request, response), position is.
  res.json({ hello: "world" });
});

server.get("/hello", (req, res) => {
  res.json({ hello: "Lambda School" });
});

server.post("/api/hubs", (req, res) => {
  const hubInfo = req.body;

  hubInfo.id = shortid.generate();

  hubs.push(hubInfo);

  res.status(201).json(hubInfo);
});

server.get("/api/hubs", (req, res) => {
  res.status(200).json(hubs);
});

server.get("/api/hubs/:id", (req, res) => {
  const found = hubs.find(hub => hub.id === id);

  if (found) {
    res.status(200).json(found);
  } else {
    res
      .status(404)
      .json({ message: "I cannot find the hub you are looking for" });
  }
});

server.patch("/api/hubs/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  let found = hubs.find(hub => hub.id === id);

  if (found) {
    Object.assign(found, changes);

    res.status(200).json(found);
  } else {
    res
      .status(404)
      .json({ message: "I cannot find the hub you are looking for" });
  }
});

server.put("/api/hubs/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  let index = hubs.findIndex(hub => hub.id === id);

  if (index !== -1) {
    hubs[index] = changes;

    res.status(200).json(hubs[index]);
  } else {
    res
      .status(404)
      .json({ message: "I cannot find the hub you are looking for" });
  }
});

server.delete("/api/hubs/:id", (req, res) => {
  const { id } = req.params;

  const deleted = hubs.find(hub => hub.id === id);

  if (deleted) {
    hubs = hubs.filter(hub => hub.id !== id);

    res.status(200).json(deleted);
  } else {
    res
      .status(404)
      .json({ message: "I cannot find the hub you are looking for" });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`);
});
