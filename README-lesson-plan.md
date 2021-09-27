# Lambda Animal Shelter Web API

## Important Notes

In order for the module challenge to be testable in Codegrade, the call to `server.listen` and the endpoints need to be in different modules. There will be more talk of project organization in future lessons but starting today students need to structure the files and folders of their Express apps following the convention demonstrated in this GP.

The endpoints are written using async db access functions that behave similarly to the functions we will write in the future using a query builder. The endpoints can be demoed using Promises or async/await. We have provided examples of both.

## Prerequisites

- [Insomnia](https://insomnia.rest) or [Postman](https://www.postman.com/downloads/) installed.

## Project Setup

The [starter code](https://github.com/LambdaSchool/node-api1-guided) for this project contains the modules necessary for the project but no `package.json`:

1. `api/dog-model.js` exposes asynchronous data access functions
1. `api/server.js` contains the endpoints and exposes the express app
1. `index.js` imports the express app and starts it

Data for the API is stored in memory using an array.

## Introduce Node and Express

Open Canvas and do a quick introduction to Node and Express.

## Add .gitignore

1. Use `npx gitignore node` to generate a `.gitignore` file. Explain what `npx` does.
1. Alternatively the `gitignore` package can be installed globally with `npm i -g gitignore` and used without `npx`.
1. Add `.DS_Store` to the generated `.gitignore` for Mac users.

## Generate package.json

1. Use `npm init -y` to generate a fresh `package.json`. Explain what it does.

## Create Basic Express Server

- Inside `api/server.js` add the following code:

  ```js
  // introduce the `CommonJS` way of importing packages as you _require_ `express`.
  const express = require("express"); // npm module, needs to be installed
  // equivalent to `import express from 'express';`

  const server = express();
  // creates an http web server

  module.exports = server;
  // equivalent to `export default server`
  ```

- Inside `index.js` add the following code:

  ```js
  const server = require("./api/server.js"); // a module inside the project
  // equivalent to `import server from './api/server.js';`

  const PORT = 5000;
  // the web server will listen for incoming traffic on port 5000

  server.listen(PORT, () => {
    // this callback function runs after the server starts sucessfully
    console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`);
  });
  ```

1. use npm to install `express`.
1. add `start` script using `node index.js`.
1. run the server with `npm start`.
1. note the logged message in the terminal.
1. navigate to `http://localhost:5000` in a browser.
1. note server responds `Cannot GET /`.
1. stop the server. Explain how to stop the server with `ctrl + c`.
1. refresh the browser window. Response is different, there is no server responding to requests on that address.
1. start the server and refresh the browser window.
1. the server is trying to process the request, but there is no code yet to send a response, we'll do that next.
1. Keep the server running.

## Add `GET /` Endpoint

- Add the following lines after `const server = express();` inside `api/server.js`:

  ```js
  // introduce `routing` and explain how requests are routed to the correct
  // `request handler function` based on the URL and HTTP verb on the request.
  // Explain what `req` and `res` are.
  server.get("/", (req, res) => {
    // name is not important (could be request, response), position is.
    res.json({ hello: "world" }); // explain .json()
  });
  ```

1. Refresh browser.
1. Same error as before, the server didn't restart.

## Make server restart on changes

1. add `nodemon` as a dev dependency with `npm i -D nodemon`.
1. add `server` script using `nodemon index.js` to the `package.json`.
1. stop the server currently running.
1. start the server using `npm run server`.
1. make a `GET` to `/`.

**any questions?**

Time for students to practice what they have learned.

### You Do (estimated 5m to complete)

Ask students to write another _endpoint_ that will handle GET requests to `/hello` and send back the following JSON object:

```json
{ "hello": "Lambda School" }
```

One of many possible solutions:

```js
server.get("/hello", (req, res) => {
  res.json({ hello: "Lambda School" });
});
```

Time for a break, **take 5 minutes**

Next, we'll learn to consume the database access functions inside our `api/server.js`.

## Import The Database Access Functions

- Add the following line at the top of `api/server.js`:

  ```js
  const Dog = require('./dog-model.js');
  ```

Explain the asynchonous methods contained inside the `Dog` object by walking students through the `api/dog-model.js` file. We are imitating database access functions, which are asynchoronous because querying a database is an example of IO and could take a long time. We want the single thread to be free to do other work (like handling other requests) while the IO operation finishes.

Next, we'll learn how to add (the `C` in CRUD) a new dog.

## Add `POST /api/dogs` Endpoint

- This endpoint expects an object with the `name` and `weight` for the dog and returns the newly created dog. The backend will generate a unique id automatically, and will also add an `adopter_id` attribute to the dog the dog with a value of `null`.

  ```js
  // [POST] /api/dogs (C of CRUD, create new dog from JSON payload)
  server.post('/api/dogs', async (req, res) => {
    // One way a client can send information is in the request body
    // axios.post(url, data) << the data will show up as req.body on the server
    // EXPRESS, BY DEFAULT IS NOT PARSING THE BODY OF THE REQUEST

    // 1- gather info from the request object
    const dog = req.body // needs use express.json() middleware

    // crude validation of req.body
    if (!dog.name || !dog.weight) {
      res.status(400).json({ message: 'name and weight are required' })
    } else {
      try {
        // 2- interact with db
        const newlyCreatedDog = await Dog.create(dog)
        // 3- send appropriate response
        res.status(201).json(newlyCreatedDog)
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    }
  })
  ```

1. This should crash. Add the `nanoid` npm package to fix the crash.
1. Explain how to make POST requests using postman.
1. Remember to **set body to raw and select JSON from the body type dropdown**, it defaults to TEXT.
1. Make a POST request to `/api/dogs`.

```json
{
  "name": "Fido",
  "weight": 25
}
```

1. The error is because express doesn't know how to parse JSON from the body.
1. Add `express.json()` middleware and explain what it does.
1. Tell students we'll know more about how `middleware` works in the _middleware module_.
1. Make the POST request again. Note that the dog we get back includes the `id`.

### You Do (estimated 5m to complete)

Ask students to delete the endpoint and recreate it from memory.

**any questions?**

Next, we'll learn how to retrieve (the `R` in CRUD) a list of dogs.

## Add `GET /api/dogs` Endpoint

- This endpoint will return a list of dogs as a JSON formatted array.

  ```js
  // [GET] /api/dogs (Read of CRUD, fetch all dogs)
  server.get('/api/dogs', (req, res) => {
    // 1- gather info from the request object (no need)
    // 2- interact with db
    Dog.findAll()
      .then(dogs => {
        // 3A- send appropriate response
        res.status(200).json(dogs)
      })
      .catch(error => {
        // 3B- send appropriate response (sad path)
        res.status(500).json({ error: error.message })
      })
  })
  ```

Make a GET request to `/api/dogs` in Postman.

### You Do (estimated 5m to complete)

Ask students to delete the endpoint and recreate it from memory.

**time for a break, take 5 minutes**

Next, we'll learn how to remove (the `D` in CRUD) a dog.

## Add `DELETE /api/dogs/:id` Endpoint

- This endpoint will return the deleted dog object.

  ```js
  // [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
  server.delete('/api/dogs/:id', (req, res) => {
    // 1- gather info from the request object
    const { id } = req.params
    // 2- interact with db
    Dog.delete(id)
      .then(deleted => {
        // 3- send appropriate response
        if (deleted) {
          res.status(200).json(deleted)
        } else {
          res.status(404).json({ message: 'dog not found with id ' + id })
        }
      })
      .catch(error => {
        res.status(500).json({ error: error.message })
      })
  })
  ```

1. make a `GET` request to `/api/dogs`, show the list of existing dogs.
1. try deleting with id `abc`. Should fail with a `404`.
1. use a valid `id` to delete a dog
1. make a `GET` request to `/api/dogs`. Note that the dog was deleted.

### You Do (estimated 5m to complete)

Ask students to delete the endpoint and recreate it from memory.

At this point we have seen how to read information from the request `body` and `url parameters`.

Next, we'll bring it all together to update (the `U` in CRUD) a dog.

## Add `PUT /api/dogs/:id` Endpoint

- This endpoint will return the updated dog object.

```js
// [PUT] /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put('/api/dogs/:id', async (req, res) => {
  // 1- pull info from req
  const changes = req.body
  const { id } = req.params

  // crude validation of req.body
  if (!changes.name || !changes.weight || changes.adopter_id === undefined) {
    res.status(400).json({ message: 'name, weight and adopter_id are required' })
  } else {
    try {
      // 2- interact with db through helper
      const updatedDog = await Dog.update(id, changes)
      // 3- send appropriate response
      if (updatedDog) {
        res.status(200).json(updatedDog)
      } else {
        res.status(404).json({ message: 'dog not found with id ' + id })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
})
```

Test the endpoint passing an updated dog. Explain the difference between `PATCH` and `PUT`.

### You Do (estimated 5m to complete)

Ask students to delete the endpoint and recreate it from memory.

Test the endpoint passing a Dog without the messages. Notice it's the messages property is removed.

### Optional You Do (estimated 5m to complete)

Ask students to create and test an endpoint to retrieve the details of a Dog.

One possible solution:

```js
// [GET] /api/dogs/:id (Read of CRUD, fetch dog by :id)
server.get('/api/dogs/:id', (req, res) => {
  // 1- gather info from the request object
  const { id } = req.params
  // 2- interact with db
  Dog.findById(id)
    .then(dog => {
      // 3A- send appropriate response
      dog
        ? res.status(200).json(dog)
        : res.status(404).json({ message: `no dog with id ${id}` })
    })
    .catch(error => {
      // 3B- send appropriate response (something crashed)
      res.status(500).json({ error: error.message })
    })
})
```
