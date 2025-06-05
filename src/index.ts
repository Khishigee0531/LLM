import express from "express";
import dotenv from "dotenv";
dotenv.config();

import router from "./routes/summarize";

const app = express();

app.use(express.json());
app.use("/summarize", router);

app.use(express.json());

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
