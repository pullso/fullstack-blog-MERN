import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if(token){
    try {
      const decoded = jwt.verify(token, 'secretsecret')
      req.userId = decoded._id
      return next()
    } catch (e) {
      console.log(e)
      return res.status(403).json({
        message: 'access denied'
      })
    }
  }

  if(!token) {
    return res.status(403).json({
      message: 'access denied'
    })
  }

  next()
}
