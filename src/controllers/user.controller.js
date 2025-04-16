import { StatusCodes } from 'http-status-codes';
import prisma from '../prisma/client';

export const findAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  return res.status(StatusCodes.OK).json(users);
};

export const findOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    return res.status(StatusCodes.OK).json(findUser);
  } catch (error) {
    console.log(error);

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

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    await prisma.user.delete({
      where: {
        id: Number(user.id),
      },
    });

    return res.json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Falha ao deletar usuário' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(findUser.id),
      },
      data: {
        name,
        email,
        passwordHash: password,
        updatedAt: new Date(),
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Falha ao atualizar o usuário' });
  }
};
