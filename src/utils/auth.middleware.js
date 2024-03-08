const jwt = require("jsonwebtoken");

// fungsi menyimpan token
const signToken = data => {
	const token = jwt.sign(data, "kode_rahasia_123", {
		expiresIn: "1d",
	});
	return token;
};

// fungsi memverifikasi token
const verifyToken = token => {
	return jwt.verify(token, "kode_rahasia_123");
};

module.exports = {
	signToken,
	verifyToken,
};
