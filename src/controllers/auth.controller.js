import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import authConfig from '../configs/auth';

export const loginUser = async (req, res) => {
  const scheme = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  try {
    const isValid = await scheme.isValid(req.body);

    const emailOrPasswordIncorrect = () =>
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Verifique se o seu e-mail ou senha estão corretos' });

    if (!isValid) {
      return emailOrPasswordIncorrect();
    }

    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return emailOrPasswordIncorrect();
    }

    const isSamePassword = await bcrypt.compare(password, user.passwordHash);

    if (!isSamePassword) {
      return emailOrPasswordIncorrect();
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Erro interno no servidor',
    });
  }
};
