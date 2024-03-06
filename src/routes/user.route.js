const router = require("express").Router();
const {
	registerUser,
	loginUser,
	getUser,
} = require("../controller/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUser);

module.exports = router;
