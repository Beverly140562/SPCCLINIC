import jwt from 'jsonwebtoken';

// doctor authencation middleware

const authDoctor = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
     if (!decoded.doctor_id) {
  return res.status(400).json({ success: false, message: 'User ID missing' });
}
req.doctor_id = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authDoctor;
