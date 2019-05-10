# Web API I Guided Project

Guided project for **Web API I** module.

In this project we will learn how to create a very simple Web API using `Node.js` and `Express`, and cover the basics of `server-side routing` and using global `middleware`.

The code for the guided project will be written in a single file for simplicity. We'll see ways to structure an API to make it more maintainable in upcoming lectures.

## Prerequisites

- [Postman](https://www.getpostman.com/downloads/) installed.

## Project Setup

The [starter code](https://github.com/LambdaSchool/webapi-i-guided) for this project is configured to run the server by typing `yarn server` or `npm run server`. The server will restart automatically on changes.

Data for the API will be stored in memory using an array.

## How to Contribute

- clone the [starter code](https://github.com/LambdaSchool/webapi-i-guided).
- create a solution branch: `git checkout -b solution`.
- add this repository as a remote: `git remote add solution https://github.com/LambdaSchool/webapi-i-guided-solution`
- pull from this repository's `master` branch into the `solution` branch in your local folder `git pull solution master:solution --force`.

A this point you should have a `master` branch pointing to the student's repository and a `solution` branch with the latest changes added to the solution repository.

When making changes to the `solution` branch, commit the changes and type `git push solution solution:master` to push them to this repository.

When making changes to the `master` branch, commit the changes and use `git push origin master` to push them to the student's repository.

## Introduce Node and Express

Open Training Kit and do a quick introduction to Node and Express.

## Create Basic Express Server

Add an `index.js` file to the root folder with the following code:

```js
// introduce the `CommonJS` way of importing packages as you _require_ `express`.
const express = require('express'); // npm module, needs to be installed
// equivalent to import express from 'express';

// import data helpers
const server = express(); // creates an http web server

// makes the web server listen for incoming traffic on port 4000
server.listen(4000, () => {
  // this callback function runs after the server starts sucessfully
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
});
```

1. use yarn or npm to install `express`.
1. run the server.
1. note the logged message in the terminal.
1. navigate to `http://localhost:4000` in a browser.
1. note server responds `Cannot GET /`.
1. stop the server. Explain how to stop the server with `ctrl + c`.
1. refresh the browser window. Note that the response is different, there is no server responding to requests on that address.
1. start the server and refresh the browser window. The server is trying to process the request, but we haven't written any code to send a response, we'll do that next.

Keep the server running.

## Add `GET /` Endpoint

Add the following lines after `const server = express();`:

```js
// Endpoints

// introduce `routing` and explain how requests are routed to the correct
// `request handler function` based on the URL and HTTP verb on the request.
// Explain what `req` and `res` are.
server.get('/', (req, res) => {
  // name is not important (could be request, response), position is.
  res.send('Hello World!');
  // .send() is a helper method that is part of the response object
});
```

Refresh browser.

**wait for students to catch up, use a `yes/no` (type /yesno message on Slack) poll to let students tell you when they are done**

Time for students to practice what they have learned.

### You Do (estimated 5m to complete)

Ask students to write another _endpoint_ that will handle GET requests to `/now` and send back today's date and time as a string.

One of many possible solutions:

```js
server.get('/now', (req, res) => {
  // search mdn javascript date to string
  const now = new Date().toISOString();
  res.send(now);
});
```

**time for a break, take 5 minutes**

Up to this point we have been responding with strings, this is good as a quick demo, but most APIs respond with data formatted as JSON. The following endpoints will do just that.

Next, we'll learn how to retrieve (the `R` in CRUD) a list of hubs.

## Add `GET /hubs` Endpoint

This endpoint will return a list of hubs as a JSON formatted array.

The file `./data/hubs-model.js` works as a data layer. It has methods for manipulating the database. Please read through the code to get familiar with it.

**All methods from the data layer return a promise**.

1. require data layer: `const db = require('./data/hubs-model.js');`. No need to make change to this file.
2. add `GET /hubs` endpoint:

```js
server.get('/hubs', (req, res) => {
  // .hubs.find() returns a promise that resolves to a list of existing hubs
  // it fails if the server's clock seconds hold an odd value. Done to simulate failures.
  // (ie. fails at 9:02:03 and 9:02:05, succeeds at 9:02:02 and 9:02:04)
  db.find()
    .then(hubs => {
      // introduce res.status() and res.json()
      res.status(200).json(hubs);
    })
    .catch(err => {
      // we ran into an error getting the hubs
      // use the catch-all 500 status code
      res.status(500).json({
        success: false,
        err,
      });
    });
});
```

3. visit `/hubs` in the browser.
4. refresh browsers a few times to see it fail when seconds hold an even value.

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

**time for a break, take 5 minutes**

Next, we'll learn how to add (the `C` in CRUD) a new hub.

## Add `POST /hubs` Endpoint

This endpoint expects an object with the `name` for the hub and returns the newly created hub. The data layer adds a new `id`, `createdAt`, and `updated_at` properties automatically to every new hub.

We can easily make GET request with a web browser, but other HTTP Methods like POST we need a REST client, we will use [Postman](https://www.getpostman.com/downloads/)

Add the endpoint:

```js
server.post('/hubs', (req, res) => {
  // one way a client can send information is in the request body
  // axios.post(url, data) << the data will show up as req.body on the server
  const hubInfo = req.body; // needs use express.json() middleware

  // we are not validating the data sent by the client for now, to keep the code simpler, but we should be validating data.
  db.add(hubInfo)
    .then(hub => {
      // hub was added successfully
      res.status(201).json({ success: true, hub });
    })
    .catch(err => {
      // we ran into an error getting the hubs
      // use the catch-all 500 status code
      res.status(500).json({
        success: false,
        err,
      });
    });
});
```

Explain how to make POST requests using postman. Remember to **set body to raw and select JSON from the body type dropdown**, it defaults to TEXT.

1. make a POST request with `{ "name": "db 1" }` as the body.
1. we should get an error because express doesn't know how to parse JSON from the body.
1. add `express.json()` middleware and explain what it does. Tell students we'll know more about how `middleware` works in the _middleware module_.
1. send the POST request again. Note that the hub we get back has `id`, `createdAt`, and `updated_at` fields.

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

Next, we'll learn how to remove (the `D` in CRUD) a hub.

## Add `DELETE /hubs/:id` Endpoint

Add the endpoint:

```js
server.delete('/hubs/:id', (req, res) => {
  // introduce req.params
  const { id } = req.params;

  db.remove(id)
    .then(deleted => {
      // the data layer returns the deleted record
      // we'll use it to check if the id provided is valid

      if (deleted) {
        // explain .end(). It ends the request and sends a response with the specified status code
        // 204 (no content) is commonly used for DELETE as there is no need to send anything back.
        res.status(204).end();
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the hub you are looking for',
        });
      }
    })
    .catch(err => {
      // we ran into an error getting the hubs
      // use the catch-all 500 status code
      res.status(500).json({
        success: false,
        err,
      });
    });
});
```

1. make a `GET` request to `/hubs`, show the list of existing hubs.
1. try deleting with id `abc`. Should fail with a `400` error.
1. use a valid `id` to delete a hub
1. make a `GET` request to `/hubs`. Note that the hub was deleted.

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

At this point we have seen how to read information from the request `body` and `url parameters`.

Time for students to practice what they have learned.

### You Do (estimated 10m to complete)

1. add `GET /hubs/:id` Endpoint that uses `db.findById(id)` and returns the hub with the provided `id` if one is found.
1. if the hub is not found for that `id`, return status code `404` and this object: `{ success: false, message: 'We couldn't find a hub with the provided id' }`.

One possible solution:

```js
server.get('/hubs/:id', (req, res) => {
  db.findById(req.params.id)
    .then(hub => {
      if (hub) {
        res.status(200).json({
          success: true,
          hub,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'We cannot find the hub you are looking for',
        });
      }
    })
    .catch(err => {
      // we ran into an error getting the hubs
      // use the catch-all 500 status code
      res.status(500).json({
        success: false,
        err,
      });
    });
});
```

1. try the endpoint with an invalid `id`. Should fail with `400` error.
1. try the endpoint with the `id` of a non existing hub. Should fail with a `404`.
1. try the endpoint with the `id` of a existing hub. Should get a `200` and the hub.

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**

**optional if there is at least 15 mins left**

Next, we'll bring it all together to update (the `U` in CRUD) a hub.

## Add `PUT /hubs/:id` Endpoint

If a hub with the provided `id` exists, this endpoint will update it and return the updated hub. If there is no hub with the provided `id`, the endpoint will respond with at `404` status code and an object with an informative `message`.

Add the endpoint:

```js
server.put('/hubs/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the hub you are looking for',
        });
      }
    })
    .catch(err => {
      // we ran into an error getting the hubs
      // use the catch-all 500 status code
      res.status(500).json({
        success: false,
        err,
      });
    });
});
```

1. try updating with an invalid `id`. Should fail with a `400` error.
1. try to change the `id` of an existing hub. Should fail with a `400` error.
1. make a `GET` to `/hubs` and show that the hub was NOT updated.
1. try updating without providing a `name`. Should fail with a `400` error.
1. make a `GET` to `/hubs` and show that the hub was NOT updated.
1. try updating with valid `id` and `name`. Should get a `200` and updated hub.
1. make a `GET` to `/hubs` and show that the hub was updated.

**wait for students to catch up, use a `yes/no` poll to let students tell you when they are done**
