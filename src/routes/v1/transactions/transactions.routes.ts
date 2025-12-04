import { FastifyInstance } from "fastify";

import { upload } from "../../../config/storage.config";
import { verifyUser } from "../../../middleware/auth.middleware";
import { checkout, cancelSubscription } from "./transactions.controllers";

const transactionRoutes = (fastify: FastifyInstance) => {
  fastify.post(
    "/checkout",
    {
      preHandler: [verifyUser("admin", "user"), upload.single("image")],
    },
    checkout
  );

  fastify.post(
    "/cancel-subscription",
    {
      preHandler: [verifyUser("admin", "user")],
    },
    cancelSubscription
  );
};

export default transactionRoutes;
