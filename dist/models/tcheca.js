"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Tcheca = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
        min: 1,
    },
    likes: [
        {
            type: mongoose_1.default.SchemaTypes.ObjectId,
            ref: "User",
        },
    ],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Tcheca", Tcheca);
