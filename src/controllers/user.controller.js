import { StatusCodes } from 'http-status-codes';
import { validate as isUuid } from 'uuid';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel';

export const findAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAllUsers();

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
    const findUser = await userModel.findUserById(id);

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

    const userExists = await userModel.findUserByEmail(email);

    if (userExists) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.createUser(name, email, hashedPassword);

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
    const user = await userModel.findUserById(id);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    await userModel.deleteUser(user);

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

    const findUser = await userModel.findUserById(id);

    if (!findUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Usuário não encontrado' });
    }

    if (email && email !== findUser.email) {
      const emailExists = await userModel.findUserByEmail(email);

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

    const updatedUser = await userModel.updateUser(
      findUser,
      name,
      email,
      password,
      hashedPassword,
    );

    return res.json(updatedUser);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.errors || 'Falha ao atualizar o usuário' });
  }
};
