const errorHandler = (err, req, res, next) => {
	console.log(err);
	if (err.code == 400) {
		res.status(400).send("Bad Request, check your request body!");
	} else if (err.code == 401) {
		res.status(401).send("Unauthorized! Please login first!");
	} else if (err.code == 403) {
		res.status(403).send("Forbidden! You don't have permission!");
	} else if (err.code == 404) {
		res.status(404).send("Not Found!");
	} else if (err.code == 409) {
		res.status(409).send("Email already registered!");
	} else {
		res.status(500).send("Internal Server Error!");
	}
};

module.exports = errorHandler;
