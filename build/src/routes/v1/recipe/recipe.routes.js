"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recipe_controllers_1 = require("./recipe.controllers");
const storage_config_1 = require("../../../config/storage.config");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const recipeRoutes = (fastify) => {
    fastify.post("/create", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin"), storage_config_1.upload.single("image")],
    }, recipe_controllers_1.createRecipe);
    fastify.patch("/update/:id", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin"), storage_config_1.upload.single("image")],
    }, recipe_controllers_1.updateRecipe);
    fastify.delete("/delete/:id", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin")],
    }, recipe_controllers_1.deleteRecipe);
    fastify.get("/all", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin")],
    }, recipe_controllers_1.getAllRecipes);
    fastify.get("/all/:id", {
        preHandler: [(0, auth_middleware_1.verifyUser)("admin")],
    }, recipe_controllers_1.getSingleRecipes);
    fastify.get("/personalized", { preHandler: [(0, auth_middleware_1.verifyUser)("user", "admin")] }, recipe_controllers_1.getPersonalizedRecipe);
};
exports.default = recipeRoutes;
//# sourceMappingURL=recipe.routes.js.map