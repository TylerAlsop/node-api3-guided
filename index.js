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

server.use((req, res) => {
	res.status(404).json({
		message: "Route was not found",
	})
})

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
