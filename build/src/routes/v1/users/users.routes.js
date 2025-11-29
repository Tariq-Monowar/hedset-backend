"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_controllers_1 = require("./users.controllers");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const usersRoutes = (fastify) => {
    fastify.get("/all", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin")],
    }, users_controllers_1.getAllUsers);
};
exports.default = usersRoutes;
//# sourceMappingURL=users.routes.js.map