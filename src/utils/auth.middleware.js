const verifyToken = require("../lib/jwt").verifyToken;
const jwt = require("jsonwebtoken");
const pool = require("../../queries");
const authentication = async (req, res, next) => {
	try {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(" ")[1]; // GET TOKEN FROM HEADER AUTHORIZATION
			if (!token) throw { code: 401 }; // ERROR CLIENT: UNAUTHORIZED

			const decoded = verifyToken(token); // GET USER FROM TOKEN
			// SEARCH USER BY ID
			const user = await pool.query(
				`SELECT * FROM users WHERE id = $1;`,
				[decoded.id]
			);

			if (user.rows.length > 0) {
				const currentUser = user.rows[0];

				// STORE USER TO REQUEST
				req.loggedUser = {
					id: currentUser.id,
					email: currentUser.email,
					role: currentUser.role,
				};
				next(); // NEXT TO NEXT MIDDLEWARE
			} else throw { code: 401 }; // ERROR CLIENT: UNAUTHORIZED
		} else throw { code: 401 }; // ERROR CLIENT: UNAUTHORIZED
	} catch (err) {
		next(err);
	}
};

const authorization = async (req, res, next) => {
	try {
		const { role } = req.loggedUser; // GET ROLE FROM REQUEST
		if (role === "admin") next(); // ALLOWED ACCESS AS ROLE ADMIN
		else throw { code: 403 }; // ERROR CLIENT: FORBIDDEN
	} catch (err) {
		next(err);
	}
};

module.exports = {
	authentication,
	authorization,
};
