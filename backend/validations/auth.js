import {body} from "express-validator";

export const loginValidation= [
  body('email').isEmail(),
  body('password').isLength({min: 6}),
]

export const registerValidation= [
  body('email').isEmail(),
  body('password').isLength({min: 6}),
  body('fullName').isLength({min: 3}),
  body('avatarUrl').optional().isURL(),
]
