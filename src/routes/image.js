const router = require("express").Router();
const multer = require("multer");
const multerConfig = require("../config/multer");
const imageController = require('../controllers/image');
const Image = require("../models/Image");

router.get("/", imageController.get);

router.post("/", multer(multerConfig).single("file"), imageController.post);

router.delete("/:id", imageController.delete);

module.exports = router;
