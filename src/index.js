import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoute.js";
import userRoutes from "./routes/userRoute.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("<h1>Hello backend</h1>[");
// });

app.use("/api", clientRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log("Listening on port 3000");
});
