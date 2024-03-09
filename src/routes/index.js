const express = require("express");
const router = express.Router();
const usersRouter = require("./user.route");
const moviesRouter = require("./movies.route");
const { authentication } = require("../utils/auth.middleware");

router.use("/api/users", usersRouter);
router.use(authentication);
router.use("/api/movies", moviesRouter);

module.exports = router;
