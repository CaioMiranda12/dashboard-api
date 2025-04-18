import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import prisma from '../prisma/client';

export const getUserTransactions = async (req, res) => {
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
};

export const createTransaction = async (req, res) => {
  const scheme = yup.object({
    title: yup.string().required(),
    description: yup.string().min(6).required(),
    amount: yup.number().positive().required(),
    category: yup.string().required(),
    type: yup.string().oneOf(['income', 'expense']).required(),
  });

  try {
    scheme.validateSync(req.body, { abortEarly: false });

    const { title, description, amount, category, type } = req.body;
    const { userId } = req;

    const transaction = await prisma.transaction.create({
      data: {
        title,
        description,
        amount,
        category,
        type,
        userId,
        date: new Date(),
      },
    });

    return res.status(StatusCodes.CREATED).json(transaction);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
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
        .json({ error: 'Acesso negado para deletar essa transação' });
    }

    await prisma.transaction.delete({
      where: {
        id: transaction.id,
      },
    });

    return res.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    return res.json('Falha ao deletar a transação');
  }
};

export const updateTransaction = async (req, res) => {
  const scheme = yup.object({
    title: yup.string(),
    description: yup.string().min(6),
    amount: yup.number().positive(),
    category: yup.string(),
    type: yup.string().oneOf(['income', 'expense']),
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
    const { title, description, amount, category, type } = req.body;
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
        .json({ error: 'Acesso negado para deletar essa transação' });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        title,
        description,
        amount,
        category,
        type,
        updatedAt: new Date(),
      },
    });

    return res.json(updatedTransaction);
  } catch (error) {
    return res.json({ error: error.errors });
  }
};
