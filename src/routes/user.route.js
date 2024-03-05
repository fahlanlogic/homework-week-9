const router = require("express").Router();
const {
	registerUser,
	loginUser,
	getUser,
} = require("../controller/user.controller");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/current", getUser);

module.exports = router;
