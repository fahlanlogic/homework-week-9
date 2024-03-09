const router = require("express").Router();
const {
	registerUser,
	loginUser,
	getUser,
	deleteUser,
	updateUser,
} = require("../controller/user.controller");
const { authorization, authentication } = require("../utils/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(authentication);
// PERLU LOGIN
router.put("/:id", updateUser);

// PERLU AUTHORISASI SEBAGAI ADMIN
router.get("/list", authorization, getUser);
router.delete("/:id", authorization, deleteUser);

module.exports = router;
