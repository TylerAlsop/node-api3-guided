// a higher order function (HOF) that returns a middleware
// function. Using an HOF allows us to pass options through
// when it's called. Options can be anything--an object, a
// string, a boolean, etc.

module.exports = (options) => {
    return (req, res, next) => {
        switch (options.format) {
            case "short":
                console.log(`${req.method} ${req.url}`)
                break
            case "long":
            default:
                console.log(`${new Date().toISOString()} ${req.ip} ${req.method} ${req.url}`)
                break
        }
        next()
    }
}
