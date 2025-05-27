import jwt from 'jsonwebtoken';

// user middleware

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const Dtoken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(Dtoken, process.env.JWT_SECRET);
    
     if (!decoded.student_id) {
  return res.status(400).json({ success: false, message: 'User ID missing' });
}
req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default verifyToken;
