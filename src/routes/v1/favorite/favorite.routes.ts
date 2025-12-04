import { FastifyInstance } from "fastify";

import { upload } from "../../../config/storage.config";
import { verifyUser } from "../../../middleware/auth.middleware";
import { getAllFavorite, manageFavorite, getSingleFavoriteByUserId } from "./favorite.controllers";

const favoriteRoutes = (fastify: FastifyInstance) => {
  fastify.post(
    "/recipe/manage",
    {
      preHandler: [verifyUser("user")],
    },
    manageFavorite
  );

  fastify.get(
    "/recipe/list",
    {
      preHandler: [verifyUser("user")],
    },
    getAllFavorite
  );
  fastify.get(
    "/recipe/single-recipe/:id",
    {
      preHandler: [verifyUser("user")],
    },
    getSingleFavoriteByUserId
  );
};

export default favoriteRoutes;
