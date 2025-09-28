// restriction middleware for Admin or Lawyer roles
const requireAdminOrLawyer = (req, res, next) => {
  const role = (req.user?.user_role || "").toLowerCase();
  const isAllowed = role.includes("admin") || role.includes("lawyer");

  if (!isAllowed) {
    return res
      .status(403)
      .json({ error: "Access denied. Admins or Lawyers only." });
  }
  next();
};

export default requireAdminOrLawyer;
