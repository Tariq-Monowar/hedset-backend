"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const setting_controllers_1 = require("./setting.controllers");
const settingRoutes = (fastify) => {
    fastify.post("/", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin")],
    }, setting_controllers_1.createSettings);
    fastify.get("/", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin", "user")],
    }, setting_controllers_1.getSettings);
};
exports.default = settingRoutes;
//# sourceMappingURL=setting.routes.js.map