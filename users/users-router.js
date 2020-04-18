const express = require("express")
const users = require("./users-model")

const router = express.Router()

// This handles the route `GET /users`
router.get("/", (req, res) => {
	// these options are supported by the `users.find` method,
	// so we get them from the query string and pass them through.
	const options = {
		// query string names are CASE SENSITIVE,
		// so req.query.sortBy is NOT the same as req.query.sortby
		sortBy: req.query.sortBy,
		limit: req.query.limit,
	}

	users.find(options)
		.then((users) => {
			res.status(200).json(users)
		})
		.catch((error) => {
			next(error)
			// Calling next(error will skip to the error handler)


			// console.log(error)
			// res.status(500).json({
			// 	message: "Error retrieving the users",
			// })
		})
})

// This handles the route `GET /users/:id`
router.get("/:id", validateUserID(), (req, res) => {
	res.status(200).json(req.user)
})

// This handles the route `POST /users`
router.post("/", validateUserCredentials(), (req, res) => {

	users.add(req.body)
		.then((user) => {
			res.status(201).json(user)
		})
		.catch((error) => {
			next(error)

			// console.log(error)
			// res.status(500).json({
			// 	message: "Error adding the user",
			// })
		})
})

// This handles the route `PUT /users/:id`
router.put("/:id", validateUserCredentials(), validateUserID(), (req, res) => {

	users.update(req.params.id, req.body)
		.then((user) => {
			res.status(200).json(user)
		})
		.catch((error) => {
			next(error)

			// console.log(error)
			// res.status(500).json({
			// 	message: "Error updating the user",
			// })
		})
})

// This handles the route `DELETE /users/:id`
router.delete("/:id", (req, res) => {
	users.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The user has been nuked",
				})
			} else {
				res.status(404).json({
					message: "The user could not be found",
				})
			}
		})
		.catch((error) => {
			next(error)

			// console.log(error)
			// res.status(500).json({
			// 	message: "Error removing the user",
			// })
		})
})

// Since posts in this case is a sub-resource of the user resource,
// include it as a sub-route. If you list all of a users posts, you
// don't want to see posts from another user.
router.get("/:id/posts", validateUserID(), (req, res) => {
	users.findUserPosts(req.params.id)
		.then((posts) => {
			res.status(200).json(posts)
		})
		.catch((error) => {
			next(error)

			// console.log(error)
			// res.status(500).json({
			// 	message: "Could not get user posts",
			// })
		})
})

// Since we're now dealing with two IDs, a user ID and a post ID,
// we have to switch up the URL parameter names.
// id === user ID and postId === post ID
router.get("/:id/posts/:postId", (req, res) => {
	users.findUserPostById(req.params.id, req.params.postId)
		.then((post) => {
			if (post) {
				res.json(post)
			} else {
				res.status(404).json({
					message: "Post was not found",
				})
			}
		})
		.catch((error) => {
			next(error)

			// console.log(error)
			// res.status(500).json({
			// 	message: "Could not get user post",
			// })
		})
})

router.post("/:id/posts", validateUserID(), (req, res) => {
	if (!req.body.text) {
		// Make sure you have a return statement, otherwise the
		// function will continue running and you'll see ERR_HTTP_HEADERS_SENT
		return res.status(400).json({
			message: "Need a value for text",
		})
	}

	users.addUserPost(req.params.id, req.body)
		.then((post) => {
			res.status(201).json(post)
		})
		.catch((error) => {
			next(error)

			// console.log(error)
			// res.status(500).json({
			// 	message: "Could not create user post",
			// })
		})
})

function validateUserID() {
	return (req, res, next) => {
		users.findById(req.params.id)
			.then((user) => {
				if (user) {
					req.user = user
					//This makes the object "user" available to later middleware functions.
					next()
					//next means that here the middleware did what it was supposed to do and now move on to the next middleware.
					// if you want to cancel the request from middleware,just don't call next
				} else {
					res.status(404).json({
						message: "The user with that ID could not be found."
					})
				}
			})
			.catch((error) => {
				next(error)

				// console.log(error)
				// res.status(500).json({
				// 	message: "Could not find user.",
				// })
			})
	}
}

function validateUserCredentials() {
	return (req, res, next) => {
		if (!req.body.name || !req.body.email) {
			return res.status(400).json({
				message: "Missing user name or email!",
			})
		} else {
			next()
		}
	}
}

module.exports = router