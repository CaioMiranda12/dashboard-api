import { StatusCodes } from 'http-status-codes';
import prisma from '../prisma/client';

export const findAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  return res.status(StatusCodes.OK).json(users);
};

export const findOneUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'ID de usuário não encontrado' });
  }

  try {
    const findUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    return res.status(StatusCodes.OK).json(findUser);
  } catch (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Usuário não encontrado' });
  }
};
