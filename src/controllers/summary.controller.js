import { StatusCodes } from 'http-status-codes';
import prisma from '../prisma/client';

export const getMonthlySummary = async (req, res) => {
  try {
    const { userId } = req;
    const { startDate, endDate } = req.query;

    const dateFilter = {};

    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    const whereFilter = {
      userId,
      ...(startDate || endDate ? { date: dateFilter } : {}),
    };

    const transactions = await prisma.transaction.findMany({
      where: whereFilter,
    });

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    return res.status(StatusCodes.OK).json({ income, expense, balance });
  } catch (error) {
    console.error('Erro no resumo por data:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao gerar o resumo por data' });
  }
};
