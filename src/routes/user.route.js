const router = require("express").Router();
const {
	registerUser,
	loginUser,
	getUser,
	deleteUser,
	updateUser,
	getUserById,
} = require("../controller/user.controller");
const { authorization, authentication } = require("../utils/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(authentication);
// HANY PERLU LOGIN TIDAK PERLU MENJADI ADMIN KARENA USER MAU UPDATE DATA
router.put("/update/:id", updateUser);

// PERLU AUTHORISASI SEBAGAI ADMIN
router.get("/", authorization, getUser);
router.get("/:id", authorization, getUserById);
router.delete("/:id", authorization, deleteUser);

module.exports = router;
