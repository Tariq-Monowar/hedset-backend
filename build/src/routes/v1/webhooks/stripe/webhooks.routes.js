"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webhooks_controllers_1 = require("./webhooks.controllers");
const stripeRoutes = (fastify) => {
    fastify.post("/manage", {
        config: {
            rawBody: true,
        },
    }, webhooks_controllers_1.manageWebhook);
};
exports.default = stripeRoutes;
//# sourceMappingURL=webhooks.routes.js.map