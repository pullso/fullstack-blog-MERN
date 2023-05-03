import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      passwordHash,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    })

    const user = await doc.save()

    const token = jwt.sign({
      _id: user._id
    }, 'secretsecret', {
      expiresIn: '30d'
    })

    const {passwordHash: hash, ...userData} = user._doc

    res.json({userData, token})
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "register failed"
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) {
      res.status(404).json({
        message: "user not found"
      })
    }
    const {passwordHash: hash, ...userData} = user._doc
    res.json(userData)
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "get info failed"
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});
    if (!user) {
      return res.status(404).json({
        message: 'login or password is not correct'
      })
    }

    const isPassValid = await bcrypt.compare(req.body.password, user._doc.passwordHash)


    if (!isPassValid) {
      return res.status(400).json({
        message: 'login or password is not correct'
      })
    }

    const token = jwt.sign({
      _id: user._id
    }, 'secretsecret', {
      expiresIn: '30d'
    })

    const {passwordHash: hash, ...userData} = user._doc

    res.json({userData, token})
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "login failed"
    })
  }
}
