const express = require("express");
const crookieController = require("../controllers/crookieController");

const router = express.Router();

router.get("/", crookieController.getbase);
router.get("/cooktime", crookieController.getcook);
router.get("/login", crookieController.getlogin);
router.get("/about", crookieController.getabout);
router.get("/help", crookieController.gethelp);

module.exports = router;
