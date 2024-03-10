const jwt = require("jsonwebtoken");

// fungsi menyimpan token
const signToken = data => {
	const token = jwt.sign(data, "Fahdi_Alan"); // SIGN TOKEN FOR AUTHENTICATION
	return token;
};

// fungsi memverifikasi token
const verifyToken = token => {
	const decoded = jwt.verify(token, "Fahdi_Alan"); // VERIFY TOKEN FOR AUTHORIZATION
	return decoded;
};

module.exports = {
	signToken,
	verifyToken,
};
