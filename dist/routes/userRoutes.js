"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middlewares/auth");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
// Register
userRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // verify if user exists
        const userExists = yield user_1.default.findOne({ username });
        if (userExists)
            return res.status(400).send({
                error: "Username already in use.",
            });
        // cripto password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(password, salt);
        // create new user
        const createUser = yield user_1.default.create({
            username,
            password: hash,
        });
        res.status(201).send({
            id: createUser.id,
            username: createUser.username,
        });
    }
    catch (error) {
        res.status(400);
        next(error);
    }
}));
// Login
userRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // check valid username
        const user = yield user_1.default.findOne({ username });
        if (!user)
            return res.status(400).send({ error: "Username not found." });
        // verify valid password
        const validpassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validpassword)
            return res.status(400).send({ error: "Invalid username or password." });
        // create validation token
        const token = jsonwebtoken_1.default.sign({ _id: user.id }, process.env.JWT_SECRET);
        res.header("auth-token", token).send(token);
    }
    catch (error) {
        res.status(400);
        next(error);
    }
}));
// Get Users
userRouter.get("/users", auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        if (!users.length)
            return res.status(400).send({ error: "Unable to get users." });
        res.status(200).send(users.map((user) => ({
            _id: user.id,
            username: user.username,
        })));
    }
    catch (error) {
        res.status(400);
        next(error);
    }
}));
