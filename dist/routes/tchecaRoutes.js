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
exports.tchecaRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const tcheca_1 = __importDefault(require("../models/tcheca"));
const tchecaRouter = (0, express_1.Router)();
exports.tchecaRouter = tchecaRouter;
// create tcheca
tchecaRouter.post("/tcheca", auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    try {
        const tcheca = yield tcheca_1.default.create({
            owner: res.locals.user,
            content,
        });
        if (!tcheca)
            res.status(400).send({ error: "Unable to create tcheca." });
        res.status(201).send(tcheca);
    }
    catch (error) {
        res.status(400);
        next(error);
    }
}));
// Delete tcheca
tchecaRouter.delete("/tcheca/:id", auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        yield tcheca_1.default.findByIdAndDelete(_id);
        res.status(200).send({ message: "Tcheca deleted." });
    }
    catch (error) {
        res.status(400);
        next(error);
    }
}));
// Update tcheca (like/unlike)
tchecaRouter.put("/tcheca/:id", auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tcheca = yield tcheca_1.default.findById(id);
        if (!tcheca)
            return res.status(400).send({ error: "Tcheca not found." });
        console.log(tcheca.owner, res.locals.user._id);
        if (tcheca.owner == res.locals.user._id)
            return res.status(400).send({ error: "Unable to update tcheca." });
        const tchecaAlreadyLiked = tcheca.likes.some((like) => like == res.locals.user._id);
        if (tchecaAlreadyLiked) {
            tcheca.likes = tcheca.likes.filter((like) => like !== res.locals.user._id);
        }
        else {
            tcheca.likes.push(res.locals.user._id);
            tcheca.save();
        }
        res.status(200).send(tcheca);
    }
    catch (error) {
        res.status(400);
        next(error);
    }
}));
// List tchecas
tchecaRouter.get("/tchecas", auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tchecas = yield tcheca_1.default.find({});
        res.status(200).send(tchecas);
    }
    catch (err) {
        res.status(400);
        next(err);
    }
}));
// FindOne tcheca
tchecaRouter.get("/tcheca/:id", auth_1.authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tcheca = yield tcheca_1.default.findById(id);
        if (!tcheca)
            return res.status(400).send({ error: "Tcheca not found." });
        res.status(200).send(tcheca);
    }
    catch (err) {
        res.status(400);
        next(err);
    }
}));
