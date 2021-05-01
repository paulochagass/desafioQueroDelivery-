const Image = require("../models/Image");
const multerConfig = require("../config/multer");
const multer = require("multer");
const aws = require("aws-sdk");
const {landscapeLabels, objectLabels} = require('./labels.json');

exports.get = async (req, res) => {
  const posts = await Image.find();
  return res.json(posts);
}

exports.postToBucket = (req, res, next) => {
  const config = multerConfig(req, res, next);
  multer(config).single("file")(req,res, next);
}

exports.post = async (req, res) => {
  const { originalname: name, size, key, location: url = "" } = req.file;
  const bucket = process.env.BUCKET_NAME;
  const photo  = key;
  const params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: photo
      },
    },
    MaxLabels: 10
  }
  const client = new aws.Rekognition({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION, 
  });
  client.detectLabels(params, async (err, {Labels}) => {
    const labels = Labels.map(({Name}) => Name)
    console.log(labels);
    const labelsPermited = ['Person','Landscape','Animal', 'Object'];
    const convertLandscapeLabels = (label) => landscapeLabels.includes(label) ? 'Landscape' : label;
    const convertObjectLabels = (label) => objectLabels.includes(label) ? 'Object' : label;
    const filterLabelsPermited = (label) => labelsPermited.includes(label);
    const labelsFiltered = [
      ...new Set(
        labels
          .map(convertLandscapeLabels)
          .map(convertObjectLabels)
          .filter(filterLabelsPermited),
      )
    ];
    const post = await Image.create({
      name,
      size,
      key,
      url,
      labels: labelsFiltered,
    });
    return res.status(201).json(post);
  });
};

exports.delete = async (req, res) => {
  const post = await Image.findById(req.params.id);
  await post.remove();
  return res.send();
}

