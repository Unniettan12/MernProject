import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import healthRoutes from "./api/health.js";
import auth from "./api/auth/index.js";
import dashboard from "./api/dashboard/index.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config(); // MUST be first
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const serverDir = path.dirname(__filename);
const root = path.dirname(serverDir);

const allowedOrigins = [
  "http://localhost:5173", // local dev (Vite)
  "https://your-app.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.static(path.join(root, "client/dist")));
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log(
    `Server running on port ${process.env.PORT}, _filename : ${root}`,
  );
});

app.get("/", (req, res) => {
  res.append({
    "Content-Type": "text/plain",
  });
  res.sendFile(path.resolve(root, "client/dist", "index.html"));
});

app.get("/health", healthRoutes);
app.use("/api/auth", auth);
app.use("/api/dashboard", dashboard);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});
