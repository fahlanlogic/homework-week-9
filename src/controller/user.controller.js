const pool = require("../../queries");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error.handler");
const { signToken } = require("../utils/auth.middleware");

const registerUser = (req, res, next) => {
	const { email, password, gender, role } = req.body; // meminta data dari body berupa json
	const hashedPassword = bcrypt.hashSync(password, 10); // hasync password

	// Pertama : checking email agar tidak menerima email yang sudah terdaftar
	// menggunakan parameter callback untuk menyimpan hasil select email
	const isEmailExist = (emailCurrent, callback) => {
		// query mencari email didatabase berdasarkan argument emailCurrent
		pool.query(
			`SELECT * FROM users WHERE email = $1;`,
			[emailCurrent],
			(err, result) => {
				if (err) {
					callback(err, null); // mengembalikan callback error tanpa hasil
				} else {
					callback(null, result.rows); // mengembalikan callback dengan result rows users
				}
			}
		);
	};

	// Kedua : menjalankan fungsi isEmailExist untuk proses insert data jika email belum teregister
	// email_from_req_body, callback
	isEmailExist(email, (err, rows) => {
		// jika user salah dalam penulisan form data
		if (!email || !password || !gender || !role) {
			next(
				errorHandler(
					400,
					"Bad Request, check your request body!"
				)
			); // error kesalahan request body pada user
		} else if (rows.length > 0) {
			// jika fungsi isEmailExist lebih dari nol artinya sudah terisi dengan email yang sesuai dengan argument email
			next(errorHandler(409, "Email already registered!")); // email sudah terdaftar
		} else {
			// Ketiga : menjalankan query insert data saat langkah error diatas lolos
			pool.query(
				`INSERT INTO users (email, password, gender, role) VALUES ($1, $2, $3, $4)`,
				[email, hashedPassword, gender, role],
				(err, result) => {
					if (err) {
						next(
							errorHandler(
								500,
								"Internal Server Error!"
							)
						); // error server
					} else {
						res.status(200).send("User Created!"); // User succes dibuat
					}
				}
			);
		}
	});
};

const loginUser = (req, res, next) => {
	const { email, password } = req.body; // meminta data dari body berupa json

	// kondisi jika typo pada request body
	if (!email || !password) {
		return next(
			errorHandler(400, "Bad Request, check your request body!") // error kesalahan request body pada user
		);
	}

	// query mencari email didatabase berdasarkan request body email
	pool.query(
		`SELECT * FROM users WHERE email = $1;`,
		[email],
		(err, result) => {
			// kondisi jika internal server error
			if (err) {
				return next(err); // error internal server
			} else {
				// kondisi jika email tidak ditemukan di database
				if (result.rows.length === 0) {
					return next(errorHandler(404, "User not found!")); // error client email belum terdaftar
				} else {
					const user = result.rows[0]; // wadah hasil query select user
					const verifyPassword = bcrypt.compareSync(
						password,
						user.password
					); // membandingkan password yang diinputkan dengan password yang ada di database
					// kondisi jika password salah
					if (!verifyPassword) {
						return next(
							errorHandler(400, "Wrong password!") // error client password salah
						);
					} else {
						// kondisi terakhir ketika tidak typo, email tersedia, dan password benar
						const token = signToken(user); // menyimpan token dengan fungsi yg sudah ada agar praktis
						// menyimpan nilai token pada headers "Authorization"
						res.setHeader(
							"Authorization",
							`Bearer ${token}`
						);
						// kembalikan respons status success dan token
						return res.status(200).json({
							message: "Login Success!",
							token: token,
						});
					}
				}
			}
		}
	);
};

const getUser = (req, res) => {};

module.exports = {
	registerUser,
	loginUser,
	getUser,
};
