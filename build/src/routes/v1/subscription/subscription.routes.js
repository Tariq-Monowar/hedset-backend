"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_config_1 = require("../../../config/storage.config");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const subscription_controllers_1 = require("./subscription.controllers");
const subscriptionRoutes = (fastify) => {
    fastify.post("/stripe/product", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin"), storage_config_1.upload.single("image")],
    }, subscription_controllers_1.createStripeProducts);
    fastify.get("/stripe/product", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin", "user"), storage_config_1.upload.single("image")],
    }, subscription_controllers_1.getStripeProducts);
    fastify.get("/stripe/product/:id", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin")],
    }, subscription_controllers_1.getSingleStripeProduct);
    fastify.patch("/stripe/product/:id", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin"), storage_config_1.upload.single("image")],
    }, subscription_controllers_1.updateStripeProducts);
    fastify.delete("/stripe/product/:id", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin"), storage_config_1.upload.single("image")],
    }, subscription_controllers_1.deleteStripeProducts);
};
exports.default = subscriptionRoutes;
//# sourceMappingURL=subscription.routes.js.map