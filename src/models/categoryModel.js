import prisma from '../prisma/client';

export const findUserCategoriesById = (userId) =>
  prisma.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

export const findUserCategoriesByName = (userId, name) =>
  prisma.category.findFirst({
    where: {
      userId,
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });

export const createUserCategory = (name, color, userId) =>
  prisma.category.create({
    data: {
      name,
      color,
      userId,
    },
  });

export const getUserCategoryById = (userId, id) =>
  prisma.category.findFirst({
    where: {
      userId,
      id: Number(id),
    },
  });

export const findTransactionsWithCategoryId = (id) =>
  prisma.transaction.findFirst({
    where: {
      categoryId: Number(id),
    },
  });

export const deleteCategory = (userId, category) =>
  prisma.category.delete({
    where: {
      userId,
      id: category.id,
    },
  });

export const getUserCategoryByName = (userId, name) =>
  prisma.category.findFirst({
    where: {
      userId,
      name,
    },
  });

export const updateCategory = (category, name, color) =>
  prisma.category.update({
    where: {
      id: category.id,
    },
    data: {
      name,
      color,
      updatedAt: new Date(),
    },
  });
