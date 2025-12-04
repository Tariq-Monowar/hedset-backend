import { getImageUrl } from "../../../utils/baseurl";

export const manageFavorite = async (request, reply) => {
  // const { recipeId } = request.params;
  const userId = request.user.id;
  const prisma = request.server.prisma;

  const { recipeId } = request.body;

  if (!userId) {
    return reply.status(401).send({
      success: false,
      message: "User not authenticated",
    });
  }

  if (!recipeId) {
    return reply.status(400).send({
      success: false,
      message: "recipeId is required",
    });
  }

  try {
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return reply.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Verify recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });

    if (!recipe) {
      return reply.status(404).send({
        success: false,
        message: "Recipe not found!",
      });
    }

    const existingFavorite = await prisma.favoriteRecipe.findFirst({
      where: {
        userId: userId,
        recipeId: recipeId,
      },
    });

    if (existingFavorite) {
      await prisma.favoriteRecipe.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      return reply.status(200).send({
        success: true,
        message: "Recipe removed from favorites!",
        isFavorited: false,
        id: existingFavorite.id,
      });
    } else {
      const newFavorite = await prisma.favoriteRecipe.create({
        data: {
          userId: userId,
          recipeId: recipeId,
        },
      });

      return reply.status(200).send({
        success: true,
        message: "Recipe added to favorites!",
        isFavorited: true,
        id: newFavorite.id,
      });
    }
  } catch (error: any) {
    request.log.error(error);

    // Handle foreign key constraint violations
    if (
      error.code === "P2003" ||
      error.message?.includes("Foreign key constraint")
    ) {
      return reply.status(400).send({
        success: false,
        message: "Invalid user or recipe ID",
        error: "The provided user or recipe does not exist",
      });
    }

    // Handle unique constraint violations
    if (error.code === "P2002") {
      return reply.status(409).send({
        success: false,
        message: "This recipe is already in your favorites",
      });
    }

    return reply.status(500).send({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const getAllFavorite = async (request, reply) => {
  try {
    const userId = request.user.id;
    const prisma = request.server.prisma;

    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await prisma.favoriteRecipe.count({
      where: {
        userId: userId,
      },
    });

    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const favorites = await prisma.favoriteRecipe.findMany({
      where: {
        userId: userId,
      },
      include: {
        recipe: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limit,
    });

    // i need to show full url baseurl
    const recipes = favorites.map((fav) => {
      const recipe = fav.recipe;

      // add baseURL with image
      return {
        ...recipe,
        image: recipe.image ? getImageUrl(recipe.image) : null,
      };
    });
    return reply.status(200).send({
      success: true,
      message: "Favorite recipes retrieved successfully!",
      data: recipes,
      pagination: {
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      },
    });
  } catch (error) {
    return reply.status(500).send({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};
