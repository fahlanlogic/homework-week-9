const pool = require("../../queries");
const bcrypt = require("bcrypt");
const { signToken } = require("../lib/jwt");

const registerUser = async (req, res, next) => {
	// FUNGSI PROMISE MENCARI USER
	const findAll = emailCurrent => {
		return new Promise((resolve, reject) => {
			pool.query(
				`SELECT * FROM users WHERE email = $1;`,
				[emailCurrent],
				(err, result) => {
					if (err) reject(err);
					resolve(result.rows);
				}
			);
		});
	};

	try {
		const { email, password, gender, role } = req.body;
		const hashedPassword = bcrypt.hashSync(password, 10);

		// MENYIMPAN DATA USER SESUAI EMAIL
		const rows = await findAll(email);

		if (!email || !password || !gender || !role) throw { code: 400 }; // ERROR CLIENT: MISSING FORM DATA

		if (rows.length > 0) throw { code: 409 }; // ERROR CLIENT: EMAIL REGISTERED

		// INSERT DATA USER
		await pool.query(
			`INSERT INTO users (email, password, gender, role) VALUES ($1, $2, $3, $4);`,
			[email, hashedPassword, gender, role]
		);
		res.status(201).send("User has been created!"); // OK: SUCCES
	} catch (err) {
		next(err);
	}
};

const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// SEARCH EMAIL
		const result = await pool.query(
			`SELECT * FROM users WHERE email = $1;`,
			[email]
		);

		if (!email || !password) throw { code: 400 }; // ERROR CLIENT: MISSING FORM DATA

		if (result.rows.length === 0) throw { code: 404 }; // ERROR CLIENT: EMAIL NOT FOUND

		const user = result.rows[0]; // VARIABLE USER
		const verifyPassword = bcrypt.compareSync(password, user.password); // COMPARE PASSWORD

		if (!verifyPassword) throw { code: 401 }; // ERROR CLIENT: WRONG CREDENTIALS

		const token = signToken(user); // MENYIMPAN TOKEN DALAM FUNGSI SIGN TOKEN

		// res.setHeader("Authorization", `Bearer ${token}`);
		return res.status(200).json({
			message: "Login Success!",
			token: token,
		}); // OK: SUCCES
	} catch (err) {
		next(err);
	}
};

const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { email, password, gender, role } = req.body;
		const hashedPassword = bcrypt.hashSync(password, 10);
		const findOne = await pool.query(
			`SELECT * FROM users WHERE id = $1;`,
			[id]
		);

		if (!email || !password || !gender || !role) throw { code: 400 }; // ERROR CLIENT: MISSING FORM DATA

		if (findOne.rows.length !== 0) {
			// UPDATE USER QUERY
			await pool.query(
				`UPDATE users SET email = $1, password = $2, gender = $3, role = $4 WHERE id = $5;`,
				[email, hashedPassword, gender, role, id]
			);
			res.status(200).send("User has been updated!"); // OK: SUCCESS UPDATED
		} else throw { code: 404 }; // ERROR CLIENT: USER NOT FOUND
	} catch (err) {
		next(err);
	}
};

const getUser = async (req, res, next) => {
	try {
		const result = await pool.query(`SELECT * FROM users;`);
		res.status(200).json(result.rows); // OK: SUCCESS
	} catch (err) {
		next(err);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const findOne = await pool.query(
			`SELECT * FROM users WHERE id = $1;`,
			[id]
		);
		if (findOne.rows.length !== 0) {
			// DELETE USER QUERY
			await pool.query(`DELETE FROM users WHERE id = $1;`, [id]);
			res.status(200).send("User has been deleted!"); // OK: SUCCESS DELETED
		} else throw { code: 404 }; // ERROR CLIENT: USER NOT FOUND
	} catch (err) {
		next(err);
	}
};

module.exports = {
	registerUser,
	loginUser,
	getUser,
	updateUser,
	deleteUser,
};
