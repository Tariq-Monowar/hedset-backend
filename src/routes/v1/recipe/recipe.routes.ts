import { FastifyInstance } from "fastify";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getListOfRecipes,
  getSingleRecipes,
  getPersonalizedRecipe,
  updateRecipe,
} from "./recipe.controllers";
import { upload } from "../../../config/storage.config";
import { verifyUser } from "../../../middleware/auth.middleware";

const recipeRoutes = (fastify: FastifyInstance) => {
    // get a list of Recipe that are  not favorited
  fastify.get(
    "/list",
    {
      preHandler: [verifyUser("user")],
    },
    getListOfRecipes
  );

  fastify.post(
    "/create",
    {
      preHandler: [verifyUser("admin"), upload.single("image")],
    },
    createRecipe
  );

  fastify.patch(
    "/update/:id",
    {
      preHandler: [verifyUser("admin"), upload.single("image")],
    },
    updateRecipe
  );

  fastify.delete(
    "/delete/:id",
    {
      preHandler: [verifyUser("admin")],
    },
    deleteRecipe
  );

  fastify.get(
    "/all",
    {
      preHandler: [verifyUser("user", "admin")],
    },
    getAllRecipes
  );

  fastify.get(
    "/all/:id",
    {
      preHandler: [verifyUser("admin", "user")],
    },
    getSingleRecipes
  );

  fastify.get(
    "/personalized",
    { preHandler: [verifyUser("user", "admin")] },
    getPersonalizedRecipe
  );
};

export default recipeRoutes;
