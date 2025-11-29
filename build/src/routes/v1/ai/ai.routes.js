"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const ai_controllers_1 = require("./ai.controllers");
const aiRoutes = (fastify) => {
    fastify.post("/asked-me", {
        preHandler: [(0, auth_middleware_1.verifyUser)("user")],
    }, ai_controllers_1.askedQuestions);
};
exports.default = aiRoutes;
//# sourceMappingURL=ai.routes.js.map