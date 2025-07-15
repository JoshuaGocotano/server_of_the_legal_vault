const requireAdmin = (req, res, next) => {
  if (req.user?.user_role !== "Admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  } 
  next();
};

export default requireAdmin;
