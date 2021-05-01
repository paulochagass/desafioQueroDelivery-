const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const Image = require("../models/Image");

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const s3Config = multerS3({
    s3: new aws.S3(),
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err);

          const fileName = `${hash.toString("hex")}-${file.originalname}`;

          cb(null, fileName);
        });
    },
});

module.exports = (req, res, next) => ({
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: s3Config,
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES,
  },
  fileFilter: (req, file, cb) => {
    Image.find({name: file.originalName, size: file.size}).then(
      img => {
        if(img) {
          return res.status(400).json({msg: 'The image alredy Exists'}) 
        }
        const allowedMimes = [
          "image/jpeg",
          "image/pjpeg",
          "image/png",
          "image/gif",
        ];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type."));
        }
      }
    )
  },
});
