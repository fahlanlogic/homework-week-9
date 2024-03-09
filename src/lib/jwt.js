const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

// fungsi menyimpan token
const signToken = data => {
	const token = jwt.sign(data, process.env.JWT_SECRET); // STORE KEY IN .env
	return token;
};

// fungsi memverifikasi token
const verifyToken = token => {
	const decoded = jwt.verify(token, process.env.JWT_SECRET); // STORE KEY IN .env
	return decoded;
};

module.exports = {
	signToken,
	verifyToken,
};
