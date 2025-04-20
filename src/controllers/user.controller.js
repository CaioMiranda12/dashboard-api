import { StatusCodes } from 'http-status-codes';
import { validate as isUuid } from 'uuid';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import prisma from '../prisma/client';

export const findAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao buscar usuários' });
  }
};

export const findOneUser = async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'ID Inválido' });
  }

  try {
    const findUser = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!findUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    return res.status(StatusCodes.OK).json(findUser);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao buscar usuário' });
  }
};

export const createUser = async (req, res) => {
  const scheme = yup.object({
    name: yup.string().required('O nome é obrigatório'),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  const { name, email, password } = req.body;

  try {
    scheme.validateSync(req.body, { abortEarly: false });

    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    return res.status(StatusCodes.CREATED).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'ID Inválido' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Falha ao deletar usuário' });
  }
};

export const updateUser = async (req, res) => {
  const scheme = yup.object({
    name: yup.string(),
    email: yup.string().email(),
    password: yup.string().min(6),
  });

  try {
    scheme.validateSync(req.body, { abortEarly: false });

    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!isUuid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'ID Inválido' });
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!findUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    if (email && email !== findUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (emailExists) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'E-mail já em uso' });
      }
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        name,
        email,
        passwordHash: password ? hashedPassword : findUser.passwordHash,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.errors || 'Falha ao atualizar o usuário' });
  }
};
