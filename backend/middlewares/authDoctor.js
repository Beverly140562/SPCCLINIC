import jwt from 'jsonwebtoken';


const authDoctor = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("Decoded doctor token:", decoded);
req.doctor_id = decoded.doctor_id;

    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};


export default authDoctor;
