"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageWebhook = void 0;
const stripe_1 = __importDefault(require("stripe"));
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY; // Add this
if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
}
if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2025-10-29.clover",
});
const manageWebhook = async (request, reply) => {
    try {
        const signatureHeader = request.headers["stripe-signature"];
        if (!signatureHeader) {
            return reply.status(400).send({
                success: false,
                message: "Missing Stripe signature header",
            });
        }
        if (!request.body) {
            console.log("============Missing request body===============");
            return reply.status(400).send({
                success: false,
                message: "Missing request body",
            });
        }
        console.log("============Request Body===============");
        let dataPreview = request.body?.data?.object;
        console.log(dataPreview);
        console.log("==================================");
        // This should now work if raw body is configured
        if (!Buffer.isBuffer(request.body)) {
            console.log("============Body is not buffer===============");
            console.log("Body type:", typeof request.body);
            console.log("Body:", request.body);
            return reply.status(400).send({
                success: false,
                message: "Invalid request body - expected raw buffer",
            });
        }
        const rawBody = request.body;
        const event = stripe.webhooks.constructEvent(rawBody, signatureHeader, webhookSecret);
        console.log("==================================");
        console.log("Stripe event type:", event.type);
        console.log("Stripe event ID:", event.id);
        console.log("==================================");
        // FIX: Remove the unreachable code!
        return reply.send({
            success: true,
            received: true,
            eventType: event.type
        });
    }
    catch (error) {
        console.error("Error processing Stripe webhook:", error);
        return reply.status(400).send({
            success: false,
            message: "Webhook Error: " + (error instanceof Error ? error.message : "Unknown error"),
        });
    }
};
exports.manageWebhook = manageWebhook;
//# sourceMappingURL=webhooks.controllers.js.map