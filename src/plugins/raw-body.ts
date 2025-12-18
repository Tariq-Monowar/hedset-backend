import fp from "fastify-plugin";
import fastifyRawBody from "fastify-raw-body";

export default fp(async (fastify) => {
  await fastify.register(fastifyRawBody, {
    field: "rawBody",
    // Enable globally so webhooks (and any forwarded requests) always
    // have the exact raw request bytes available for signature checks.
    global: true,
    // Keep the raw body as a Buffer so Stripe signature verification
    // uses the original bytes.
    encoding: false,
    runFirst: true,
    
  });
});


