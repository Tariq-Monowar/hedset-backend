"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const personalization_controllers_1 = require("./personalization.controllers");
const personalizationRoutes = (fastify) => {
    fastify.post("/", {
        preHandler: [(0, auth_middleware_1.verifyUser)("user")],
    }, personalization_controllers_1.createPersonalization);
    fastify.get("/", {
        preHandler: [(0, auth_middleware_1.verifyUser)("user")],
    }, personalization_controllers_1.checkOk);
};
exports.default = personalizationRoutes;
//# sourceMappingURL=personalization.routes.js.map