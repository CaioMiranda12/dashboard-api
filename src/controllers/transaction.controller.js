import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import prisma from '../prisma/client';

export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(StatusCodes.OK).json(transactions);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao buscar transações' });
  }
};

export const getOneTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: Number(id),
        userId,
      },
    });

    return res.status(StatusCodes.OK).json(transaction);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao buscar transação' });
  }
};

export const createTransaction = async (req, res) => {
  const scheme = yup.object({
    title: yup.string().required(),
    description: yup.string().min(6).required(),
    amount: yup.number().positive().required(),
    categoryId: yup.number().min(1).required(),
    type: yup.string().oneOf(['income', 'expense']).required(),
    date: yup.date().optional(),
  });

  try {
    scheme.validateSync(req.body, { abortEarly: false });

    const { title, description, amount, categoryId, type, date } = req.body;
    const { userId } = req;

    const categoryExists = await prisma.category.findFirst({
      where: {
        userId,
        id: categoryId,
      },
    });

    if (!categoryExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Categoria não encontrada' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        description,
        amount,
        categoryId,
        type,
        userId,
        date: date ? new Date(date) : new Date(),
      },
    });

    return res.status(StatusCodes.CREATED).json(transaction);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.errors || 'Erro inesperado' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!transaction) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Transação não encontrada' });
    }

    if (transaction.userId !== userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado' });
    }

    await prisma.transaction.delete({
      where: {
        id: transaction.id,
      },
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Falha ao deletar a transação' });
  }
};

export const updateTransaction = async (req, res) => {
  const scheme = yup.object({
    title: yup.string(),
    description: yup.string().min(6),
    amount: yup.number().positive(),
    categoryId: yup.number().min(1),
    type: yup.string().oneOf(['income', 'expense']),
    date: yup.date(),
  });

  try {
    const validatedData = scheme.validateSync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (Object.keys(validatedData).length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Nenhum campo válido foi enviado para atualização' });
    }

    const { id } = req.params;
    const { userId } = req;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!transaction) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Transação não encontrada' });
    }

    if (transaction.userId !== userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Acesso negado' });
    }

    if (validatedData.categoryId) {
      const categoryExists = await prisma.category.findFirst({
        where: {
          userId,
          id: validatedData.categoryId,
        },
      });

      if (!categoryExists) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Categoria não encontrada' });
      }
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return res.status(StatusCodes.OK).json(updatedTransaction);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.errors || 'Erro inesperado' });
  }
};
