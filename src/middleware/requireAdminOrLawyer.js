// restriction middleware for Admin or Lawyer roles
const requireAdminOrLawyer = (req, res, next) => {
  if (req.user?.user_role !== "Admin" && req.user?.user_role !== "Lawyer") {
    return res
      .status(403)
      .json({ error: "Access denied. Admins or Lawyers only." });
  }
  next();
};

export default requireAdminOrLawyer;
