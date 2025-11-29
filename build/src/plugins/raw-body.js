"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const fastify_raw_body_1 = __importDefault(require("fastify-raw-body"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    await fastify.register(fastify_raw_body_1.default, {
        field: "rawBody",
        global: false,
        encoding: false,
        runFirst: true,
    });
});
//# sourceMappingURL=raw-body.js.map