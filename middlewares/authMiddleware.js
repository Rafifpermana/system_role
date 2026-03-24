const jwt = require("jsonwebtoken");

// Middleware untuk memverifikasi JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Token tidak disediakan atau format salah" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }
};

// Middleware untuk membatasi akses berdasarkan role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Akses ditolak: Anda tidak memiliki izin untuk resource ini",
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
};
