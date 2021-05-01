const router = require("express").Router();
const imageController = require('../controllers/image');
const Image = require("../models/Image");

router.get("/", imageController.get);

router.post(
  "/",
  imageController.postToBucket,
  imageController.post
);

router.delete("/:id", imageController.delete);

module.exports = router;
