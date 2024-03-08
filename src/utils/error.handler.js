const error = new Error();
const errorHandler = (statusCode, message) => {
	error.statusCode = statusCode;
	error.message = message;
	return error;
};

module.exports = errorHandler;
