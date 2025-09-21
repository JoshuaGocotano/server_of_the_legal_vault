import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import branchRoutes from "./routes/branchRoute.js";
import clientRoutes from "./routes/clientRoute.js";
import caseRoutes from "./routes/caseRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import documentRoutes from "./routes/documentRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:4000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", branchRoutes);
app.use("/api", userRoutes);
app.use("/api", clientRoutes);
app.use("/api", authRoutes); // authentication api
app.use("/api", caseRoutes);
app.use("/api", paymentRoutes);
app.use("/api", documentRoutes);
app.use("/api", notificationRoutes);

app.use("/uploads", express.static("C:/Users/Noel Batoctoy/caps/uploads")); // user profile uploads
app.use(
  "/uploads/taskedDocs",
  express.static("C:/Users/Noel Batoctoy/caps/uploads/taskedDocs")
); // tasked document uploads
app.use(
  "/uploads/supportingDocs",
  express.static("C:/Users/Noel Batoctoy/caps/uploads/supportingDocs")
); // supporting document uploads

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});

// Testing to get the IP address of the user
app.get("/api/ip", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || // for reverse proxies
    req.socket?.remoteAddress ||
    null;

  res.json({ ip });
});
