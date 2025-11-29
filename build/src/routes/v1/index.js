"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const recipe_routes_1 = __importDefault(require("./recipe/recipe.routes"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const setting_routes_1 = __importDefault(require("./settings/setting.routes"));
const personalization_routes_1 = __importDefault(require("./personalization/personalization.routes"));
const subscription_routes_1 = __importDefault(require("./subscription/subscription.routes"));
const favorite_routes_1 = __importDefault(require("./favorite/favorite.routes"));
const ai_routes_1 = __importDefault(require("./ai/ai.routes"));
const transactions_routes_1 = __importDefault(require("./transactions/transactions.routes"));
const webhooks_routes_1 = __importDefault(require("./webhooks/stripe/webhooks.routes"));
async function routesV1(fastify) {
    const moduleRoutes = [
        { path: "/auth", route: auth_routes_1.default },
        { path: "/recipe", route: recipe_routes_1.default },
        { path: "/users", route: users_routes_1.default },
        { path: "/setting", route: setting_routes_1.default },
        { path: "/personalization", route: personalization_routes_1.default },
        { path: "/subscription", route: subscription_routes_1.default },
        { path: "/favorite", route: favorite_routes_1.default },
        { path: "/transactions", route: transactions_routes_1.default },
        { path: "/ai", route: ai_routes_1.default },
        { path: "/webhooks/stripe", route: webhooks_routes_1.default },
    ];
    moduleRoutes.forEach(({ path, route }) => {
        fastify.register(route, { prefix: path });
    });
}
exports.default = routesV1;
//# sourceMappingURL=index.js.map