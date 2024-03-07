const pool = require("../../queries");
const bcrypt = require("bcrypt");

const registerUser = (req, res) => {
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
			res.status(400).send("Bad Request, check your request body!"); // error kesalahan request body pada user
		} else if (rows.length > 0) {
			// jika fungsi isEmailExist lebih dari nol artinya sudah terisi dengan email yang sesuai dengan argument email
			res.status(400).send("Email already registered!"); // email sudah terdaftar
		} else {
			// Ketiga : menjalankan query insert data saat langkah error diatas lolos
			pool.query(
				`INSERT INTO users (email, password, gender, role) VALUES ($1, $2, $3, $4)`,
				[email, hashedPassword, gender, role],
				(err, result) => {
					if (err) {
						res.status(500).send(
							"Internal Server Error"
						); // error server
					} else {
						res.status(200).send("User Created!"); // User succes dibuat
					}
				}
			);
		}
	});
};

const loginUser = (req, res) => {};

const getUser = (req, res) => {};

module.exports = {
	registerUser,
	loginUser,
	getUser,
};
