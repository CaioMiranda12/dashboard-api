import { StatusCodes } from 'http-status-codes';
import * as TransactionModel from '../models/transactionModel';

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

    const transactions =
      await TransactionModel.findUserTransactionsByDate(whereFilter);

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    return res.status(StatusCodes.OK).json({ income, expense, balance });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao gerar o resumo por data' });
  }
};

export const getYearSummary = async (req, res) => {
  try {
    const { userId } = req;
    const year = Number(req.query.year) || new Date().getFullYear();

    const transactions = await TransactionModel.findUserTransactionsByYear(
      userId,
      year,
    );

    const summaryByMonth = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          income: 0,
          expense: 0,
          balance: 0,
        };
      }

      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc[monthKey].expense += transaction.amount;
      }

      acc[monthKey].balance = acc[monthKey].income - acc[monthKey].expense;

      return acc;
    }, {});

    return res.json(summaryByMonth);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao gerar o resumo por ano' });
  }
};
