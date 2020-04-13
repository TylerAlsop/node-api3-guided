const express = require("express")
const cors = require("cors");
const morgan = require("morgan");

const welcomeRouter = require("./welcome/welcome-router")
const usersRouter = require("./users/users-router")

const server = express()
const port = 4000

server.use(express.json())
server.use(cors())
server.use(morgan())

server.use("/", welcomeRouter)
server.use("/users", usersRouter)

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
