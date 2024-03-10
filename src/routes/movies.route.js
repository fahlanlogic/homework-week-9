const router = require("express").Router();
const {
	getMovies,
	getMovieById,
	addMovie,
	updateMovie,
	deleteMovie,
} = require("../controller/movie.controller");
const authorization = require("../utils/auth.middleware").authorization;

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/add", authorization, addMovie);
router.put("/update/:id", authorization, updateMovie);
router.delete("/:id", authorization, deleteMovie);

module.exports = router;
