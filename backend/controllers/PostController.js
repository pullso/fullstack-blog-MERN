import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()
    const tags = posts?.map(p=>p?.tags).flat()
    const uniqueTags = [...new Set(tags)].slice(0,5)
    res.json(uniqueTags)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "can not get posts"
    })
  }
};


export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId
    })

    const post = await doc.save()
    res.json(post)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "can not make post"
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user', 'fullName email').exec()
    res.json(posts)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "can not get posts"
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const post = await PostModel.findOneAndUpdate(
      {_id: req.params.id},
      {$inc: {viewsCount: 1}},
      {returnDocument: "after"},
    ).populate('user', 'fullName email').exec()

    if (!post) {
      return res.status(404).json({
        message: "can not get post"
      })
    }

    return res.json(post)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "can not get post"
    })
  }
}
export const remove = async (req, res) => {
  try {
    await PostModel.findOneAndDelete(
      {_id: req.params.id, user: req.userId},
    )

    return res.json({
      success: true
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "can not delete post"
    })
  }
}
export const update = async (req, res) => {
  try {
    await PostModel.findOneAndUpdate(
      {_id: req.params.id, user: req.userId},
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId
      }
    )

    return res.json({
      success: true
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "can not update post"
    })
  }
}
