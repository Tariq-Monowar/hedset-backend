import { FastifyRequest, FastifyReply } from "fastify";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

interface CheckoutRequestBody {
  subscriptionPackageId: string;
}

export const checkout = async (
  request: FastifyRequest<{ Body: CheckoutRequestBody }>,
  reply: FastifyReply
) => {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return reply.status(404).send({
        success: false,
        message: "User not found",
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

      success_url:
        `myflutterapp://payment-success?session`,
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
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: "Failed to create checkout session",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Cancel user's active subscription
 * Cancels the subscription in Stripe, webhook will handle database updates
 */
export const cancelSubscription = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = request.user?.id;
    const prisma = request.server.prisma;

    if (!userId) {
      return reply.status(401).send({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find user's account with subscription info
    const account = await prisma.account.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!account) {
      return reply.status(404).send({
        success: false,
        message: "Account not found",
      });
    }

    if (!account.stripeSubscriptionId) {
      return reply.status(400).send({
        success: false,
        message: "No active subscription found",
      });
    }

    // Cancel the subscription in Stripe immediately
    const canceledSubscription = await stripe.subscriptions.cancel(
      account.stripeSubscriptionId
    );

    request.log.info(`Subscription cancellation initiated for user ${userId}`);

    return reply.status(200).send({
      success: true,
      message: "Subscription cancellation initiated successfully",
      data: {
        subscriptionId: canceledSubscription.id,
        status: canceledSubscription.status,
        canceledAt: canceledSubscription.canceled_at
          ? new Date(canceledSubscription.canceled_at * 1000)
          : null,
      },
    });
  } catch (error) {
    request.log.error({ err: error }, "Error canceling subscription");

    const stripeError = error as any;
    if (stripeError?.type?.startsWith("Stripe") || stripeError?.code) {
      return reply.status(400).send({
        success: false,
        message: `Stripe error: ${stripeError.message || "Unknown Stripe error"}`,
      });
    }

    return reply.status(500).send({
      success: false,
      message: "Failed to cancel subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

