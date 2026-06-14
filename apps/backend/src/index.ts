import express from "express";
import cors from "cors";
import { APP_NAME } from "@job-tracker/shared";
import { prisma } from "./db.js";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import applicationRoutes from "./routes/application.routes.js";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
    const userCount = await prisma.user.count();
    res.json({
        message: `${APP_NAME} API is running!`,
        users: userCount
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

