import {body} from "express-validator";

export const postValidation= [
  body('title').isLength({min: 3}).isString(),
  body('text').isLength({min: 6}).isString(),
  body('tags').optional().isString(),
  body('imageUrl').optional().isString(),
]
