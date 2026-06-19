const express = require("express");
const { userLogin, addUser } = require("../../controllers/common/commonController");

const router = express.Router();

// Route to add a new user
router.post("/register", addUser);
router.post("/login", userLogin);

module.exports = router;
