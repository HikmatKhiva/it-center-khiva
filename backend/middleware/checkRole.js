export async function checkRole(req, res, next) {
  const admin = req.admin;
  if (!admin || admin.role !== "ADMIN") {
    return res.status(401).json({ message: "Sizda ruxsat mavjud emas!" });
  }
  next();
}
