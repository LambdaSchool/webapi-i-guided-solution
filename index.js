const express = require("express");
const shortid = require("shortid");

const server = express();

let dogs = [];

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

server.post("/api/dogs", (req, res) => {
  const newDog = { ...req.body, adopter_id: null };

  newDog.id = shortid.generate();

  dogs.push(newDog);

  res.status(201).json(newDog);
});

server.get("/api/dogs", (req, res) => {
  res.status(200).json(dogs);
});

server.get("/api/dogs/:id", (req, res) => {
  const found = dogs.find(dog => dog.id === req.params.id);

  if (found) {
    res.status(200).json(found);
  } else {
    res
      .status(404)
      .json({ message: "I cannot find the dog you are looking for" });
  }
});

server.patch("/api/dogs/:id", (req, res) => {
  const { id } = req.params;
  const changes = { ...req.body, id };

  let found = dogs.find(dog => dog.id === id);

  if (found) {
    Object.assign(found, changes);

    res.status(200).json(found);
  } else {
    res
      .status(404)
      .json({ message: "I cannot find the dog you are looking for" });
  }
});

server.put("/api/dogs/:id", (req, res) => {
  const { id } = req.params;
  const changes = { ...req.body, id };

  let index = dogs.findIndex(dog => dog.id === id);

  if (index !== -1) {
    dogs[index] = changes;

    res.status(200).json(dogs[index]);
  } else {
    res
      .status(404)
      .json({ message: "I cannot find the dog you are looking for" });
  }
});

server.delete("/api/dogs/:id", (req, res) => {
  const { id } = req.params;

  const deleted = dogs.find(dog => dog.id === id);

  if (deleted) {
    dogs = dogs.filter(dog => dog.id !== id);

    res.status(200).json(deleted);
  } else {
    res
      .status(404)
      .json({ message: "I cannot find the dog you are looking for" });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`);
});
