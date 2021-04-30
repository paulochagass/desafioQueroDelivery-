const Image = require("../models/Image");

exports.get = async (req, res) => {
  const posts = await Image.find();
  return res.json(posts);
}

exports.post = async (req, res) => {
  const { originalname: name, size, key, location: url = "" } = req.file;
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

