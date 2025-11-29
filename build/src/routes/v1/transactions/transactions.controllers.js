"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const checkout = async (request, reply) => {
    try {
        const { subscriptionPackageId } = request.body;
        const userId = request.user?.id;
        const prisma = request.server.prisma;
        if (!userId) {
            return reply.status(401).send({
                success: false,
                message: "User not authenticated",
            });
        }
        if (!subscriptionPackageId) {
            return reply.status(400).send({
                success: false,
                message: "Subscription package ID is required",
            });
        }
        const subscriptionPackage = await prisma.subscriptionPackage.findUnique({
            where: { id: subscriptionPackageId },
        });
        if (!subscriptionPackage) {
            return reply.status(404).send({
                success: false,
                message: "Subscription package not found",
            });
        }
        if (!subscriptionPackage.stripePriceId) {
            return reply.status(400).send({
                success: false,
                message: "Stripe priceId not configured for this package",
            });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: subscriptionPackage.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `myflutterapp://payment-success?session`,
            cancel_url: "myflutterapp://payment-cancel",
            client_reference_id: userId,
            metadata: {
                userId: userId,
                subscriptionPackageId: subscriptionPackageId,
            },
        });
        // Create transaction record
        const transaction = await prisma.transaction.create({
            data: {
                userId: userId,
                subscriptionPackageId: subscriptionPackageId,
                amount: subscriptionPackage.amount,
                currency: subscriptionPackage.currency,
                stripeSessionId: session.id,
                status: "pending",
                autoRenewal: true,
            },
        });
        return reply.status(200).send({
            success: true,
            message: "Checkout session created successfully",
            data: {
                sessionId: session.id,
                url: session.url,
                transactionId: transaction.id,
            },
        });
    }
    catch (error) {
        request.log.error(error);
        return reply.status(500).send({
            success: false,
            message: "taka nai, apni gorib!",
            error: error.message,
        });
    }
};
exports.checkout = checkout;
//------------------------------
//# sourceMappingURL=transactions.controllers.js.map