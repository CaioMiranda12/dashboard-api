import prisma from '../prisma/client';

export const findAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  return res.json(users);
};

export const findOneUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.json({ message: 'ID de usuário não encontrado' });
  }

  try {
    const findUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    return res.json(findUser);
  } catch (error) {
    return res.json({ message: 'Usuário não encontrado' });
  }
};
