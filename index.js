//////// Require ////////
const express = require("express");
const cors = require("cors");
// const morgan = require("morgan");
const logger = require("./middleware/logger")


//////// Routers ////////
const welcomeRouter = require("./welcome/welcome-router");
const usersRouter = require("./users/users-router");

//////// Servers / Middlewares ////////
const server = express()
const port = 4000

server.use(express.json())
server.use(cors())
// server.use(morgan())
server.use(logger({ format: "short" }));

server.use("/", welcomeRouter)
server.use("/users", usersRouter)

// this middleware function will only run if no route is found.
// routes never call `next()`, so if a route is found, this never runs.
server.use((req, res) => {
	res.status(404).json({
		message: "Route was not found.",
	})
})

// any time a middleware function calls `next` with a parameter, like `next(error)`,
// this middleware function will run. The stack skips directly down to it, like a
// catch statement.
server.use((err, req, res, next) => {
	console.log(err)
		// we never want to expose the details of a server error
		// to the client, since it could potentially contain sensitive
		// info. Keep the message generic, and log out the details for
		// the developer to see.
	res.status(500).json({
		message: "Oops! Something went wrong!"
	})
})

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
