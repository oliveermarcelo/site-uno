const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "uno-erp-secret-key-change-in-production";

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Token não fornecido" });

  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = { auth, SECRET };
