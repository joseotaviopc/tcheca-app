"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandling = exports.notFound = void 0;
// Not Found Middleware
const notFound = (req, res, next) => {
    const error = new Error(`😢 Requested path ${req.originalUrl} not found!`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
// Error Middleware
const errorHandling = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.statusCode = statusCode;
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? "🤓" : error.stack,
    });
};
exports.errorHandling = errorHandling;
