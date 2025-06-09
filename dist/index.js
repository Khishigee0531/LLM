"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const summarize_1 = __importDefault(require("./routes/summarize"));
const db_1 = require("./db/db");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.get("/protected", auth_2.authenticateToken, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});
app.use("/summarize", summarize_1.default);
app.get("/health", (req, res) => res.send("OK"));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
    // Connect to DB first, then start server
    (0, db_1.connectDB)().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    });
}
exports.default = app;
