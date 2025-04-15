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
      .json({ error: 'ID de usuário não encontrado' });
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
      .json({ error: 'Usuário não encontrado' });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExits = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExits) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'E-mail já cadastrado' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password,
      },
    });

    return res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Falha ao criar usuário' });
  }
};
