import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1]; // Bearer tokenstring
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      console.log("Forbidden: Not an admin");
      return res.status(403).json({ success: false, message: "Forbidden: Admin only" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.log("JWT Verification error:", err.message); // 🔍 MORE DESCRIPTIVE
    return res.status(401).json({ success: false, message: err.message });
  }
};

export default authAdmin;
