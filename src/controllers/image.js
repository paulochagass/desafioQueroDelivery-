const Image = require("../models/Image");
const aws = require("aws-sdk");

exports.get = async (req, res) => {
  const posts = await Image.find();
  return res.json(posts);
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
  client.detectLabels(params, function(err, response) {
    if (err) {
      console.log(err, err.stack);
    } else {
      response.Labels.forEach(label => {
        console.log(`Label:      ${label.Name}`)
      })
    }
  });
  const imageContain = [];
  const post = await Image.create({
    name,
    size,
    key,
    url,
    imageContain,
  });
  return res.status(201).json(post);
};

exports.delete = async (req, res) => {
  const post = await Image.findById(req.params.id);
  await post.remove();
  return res.send();
}

