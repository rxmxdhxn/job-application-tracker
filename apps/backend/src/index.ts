import express from "express";
import cors from "cors";
import { APP_NAME } from "@job-tracker/shared";
import { prisma } from "./db.js";
import "dotenv/config";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    const userCount = await prisma.user.count();
    res.json({
        message: `${APP_NAME} API is running!`,
        users: userCount
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

