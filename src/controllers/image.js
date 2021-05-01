const Image = require("../models/Image");
const multerConfig = require("../config/multer");
const multer = require("multer");
const aws = require("aws-sdk");
const {landscapeLabels, objectLabels} = require('./labels.json');

exports.get = async (req, res) => {
  const images = await Image.find();
  return res.status(200).json(images);
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
  };
  const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION, 
  };
  const client = new aws.Rekognition(awsConfig);
  client.detectLabels(params, async (err, {Labels}) => {
    const image = new Image();
    const labels = Labels.map(({Name}) => Name)
    console.log(labels);
    if(labels.includes('Text')){
      const paramsText = {
        Document: {
          S3Object: {
            Bucket: bucket,
            Name: photo
          },
        },
        FeatureTypes: ['TABLES','FORMS'],
      };
      const textract = new aws.Textract(awsConfig);
      const request = textract.analyzeDocument(paramsText);
      const data = await request.promise();
      image.text = data;
    }
    const labelsPermited = ['Person','Landscape','Animal', 'Object', 'Text'];
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
    image.name = name;
    image.size = size;
    image.key = key;
    image.url = url;
    image.labels = labelsFiltered;
    const post = await image.save();
    /*
    const post = await Image.create({
      name,
      size,
      key,
      url,
      labels: labelsFiltered,
    });
    */
    return res.status(201).json(post);
  });
};

exports.delete = async (req, res) => {
  const image = await Image.findById(req.params.id);
  await image.remove();
  return res.status(200).json('Image removed');
}

