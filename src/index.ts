import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

import router from "./routes/summarize";
import { connectDB } from "./db/db";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/auth", authRouter);
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted", user: (req as any).user });
});

app.use("/summarize", router);

app.get("/health", (req, res) => res.send("OK"));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  // Connect to DB first, then start server
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
