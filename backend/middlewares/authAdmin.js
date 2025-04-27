import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Bearer token
  console.log("Token received:", token); 
  if (!req.headers.authorization) {
    return res.json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ message: 'Token has expired'  });
    }

    req.user = decoded;  // Store decoded user info in req.user
    next();
  });
};

export default authAdmin;
