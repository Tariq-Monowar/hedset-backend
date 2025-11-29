"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const favorite_controllers_1 = require("./favorite.controllers");
const favoriteRoutes = (fastify) => {
    fastify.post("/recipe/:recipeId", {
        preHandler: [(0, auth_middleware_1.verifyUser)("user")],
    }, favorite_controllers_1.manageFavorite);
    fastify.get("/recipe/list", {
        preHandler: [(0, auth_middleware_1.verifyUser)("user")],
    }, favorite_controllers_1.getAllFavorite);
};
exports.default = favoriteRoutes;
//# sourceMappingURL=favorite.routes.js.map