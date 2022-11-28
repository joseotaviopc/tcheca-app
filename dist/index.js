"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = require("./routes");
const middlewares_1 = require("./middlewares");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3333;
try {
    mongoose_1.default.connect(process.env.DB_URL, () => console.log("🚀 Connected to the database!"));
}
catch (error) {
    console.error(error);
}
app.use(express_1.default.json());
app.use((0, morgan_1.default)("common"));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
}));
// Routes
app.use(routes_1.userRouter);
app.use(routes_1.tchecaRouter);
// Not Found Middleware
app.use(middlewares_1.notFound);
// Error Middleware
app.use(middlewares_1.errorHandling);
app.listen(PORT, () => {
    console.log(`🔥 Tcheca server is running on port ${PORT}`);
});
