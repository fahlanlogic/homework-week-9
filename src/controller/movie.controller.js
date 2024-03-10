const pool = require("../../queries");

const getMovies = async (req, res, next) => {
	try {
		const result = await pool.query(
			`SELECT * FROM movies ${pagination(req.query)};`
		);
		res.status(200).json({ data: result.rows }); // OK: SUCCESS
	} catch (err) {
		next(err);
	}
};

const getMovieById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			`SELECT * FROM movies WHERE id = $1;`,
			[id]
		);

		if (result.rows.length === 0) throw { code: 404 }; // ERROR CLIENT: MOVIE NOT FOUND
		res.status(200).json(result.rows[0]); // OK: SUCCESS
	} catch (err) {
		next(err);
	}
};

const addMovie = async (req, res, next) => {
	try {
		const { title, genres, year } = req.body;

		if (!title || !genres || !year) throw { code: 400 }; // ERROR CLIENT: MISSING FORM DATA

		const result = await pool.query(
			`INSERT INTO movies (title, genres, year) VALUES ($1, $2, $3) RETURNING *;`,
			[title, genres, year]
		);
		res.status(201).json({
			message: "Movie has been created",
			addMovie: result.rows[0],
		}); // CREATED: SUCCESS
	} catch (err) {
		next(err);
	}
};

const updateMovie = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, genres, year } = req.body;
		const result = await pool.query(
			`UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4 RETURNING *;`,
			[title, genres, year, id]
		);

		if (!title || !genres || !year) throw { code: 400 }; // ERROR CLIENT: MISSING FORM DATA
		if (result.rows.length === 0) throw { code: 404 }; // ERROR CLIENT: MOVIE NOT FOUND

		res.status(200).json({
			message: "Movie has been updated",
			updateMovie: result.rows[0],
		}); // OK: SUCCESS UPDATED
	} catch (err) {
		next(err);
	}
};

const deleteMovie = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			`DELETE FROM movies WHERE id = $1 RETURNING *;`,
			[id]
		);

		if (result.rows.length === 0) throw { code: 404 }; // ERROR CLIENT: MOVIE NOT FOUND

		res.status(200).json({
			message: "Movie has been deleted",
			deleteMovie: result.rows[0],
		}); // OK: SUCCESS DELETED
	} catch (err) {
		next(err);
	}
};

// FUNCTION PAGINATION FOR INJECT TO QUERY
const pagination = params => {
	// GIVE DEFAULT VALUE
	const { page = 1, limit = 10 } = params;

	// CHECK PARAMS
	if (Object.entries(params).length === 0) {
		return "";
	} else {
		return `LIMIT ${limit} OFFSET ${(page - 1) * limit}`; // SET QUERY LIMIT AND OFFSET BY PARAMS
	}
};

module.exports = {
	getMovies,
	getMovieById,
	addMovie,
	updateMovie,
	deleteMovie,
};
