"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_config_1 = require("../../../config/storage.config");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const transactions_controllers_1 = require("./transactions.controllers");
const transactionRoutes = (fastify) => {
    fastify.post("/checkout", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin", "user"), storage_config_1.upload.single("image")],
    }, transactions_controllers_1.checkout);
};
exports.default = transactionRoutes;
//# sourceMappingURL=transactions.routes.js.map