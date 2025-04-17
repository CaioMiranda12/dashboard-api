import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import authConfig from '../configs/auth';

function authMiddleware(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Token não fornecido' });
  }

  const token = authToken.split(' ').at(1);

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error();
      }

      req.userId = decoded.id;
    });
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Token inválido' });
  }

  return next();
}

export default authMiddleware;
