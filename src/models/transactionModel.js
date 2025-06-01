import prisma from '../prisma/client';

export const findUserTransactions = (userId) =>
  prisma.transaction.findMany({
    where: {
      userId,
    },
    include: {
      Category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

export const getUserTransactionById = (userId, id) =>
  prisma.transaction.findFirst({
    where: {
      id: Number(id),
      userId,
    },
    include: {
      Category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

export const createTransaction = (
  title,
  description,
  amount,
  categoryId,
  type,
  userId,
  date,
) =>
  prisma.transaction.create({
    data: {
      title,
      description,
      amount,
      categoryId,
      type,
      userId,
      date: date ? new Date(date) : new Date(),
    },
    include: {
      Category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

export const deleteTransaction = (transaction) =>
  prisma.transaction.delete({
    where: {
      id: transaction.id,
    },
  });

export const updateTransaction = (transaction, validatedData, inputDate) =>
  prisma.transaction.update({
    where: {
      id: transaction.id,
    },
    data: {
      ...validatedData,
      date: inputDate,
      updatedAt: new Date(),
    },
    include: {
      Category: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

export const findUserTransactionsByDate = (whereFilter) =>
  prisma.transaction.findMany({
    where: whereFilter,
  });

export const findUserTransactionsByYear = (userId, year) => {
  const now = new Date(year, 0);

  const firstDay = new Date(now.getFullYear(), 0, 1);

  const lastDay = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

  return prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: firstDay,
        lte: lastDay,
      },
    },
  });
};
