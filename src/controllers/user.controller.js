import prisma from '../prisma/client.js'

export const findAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  return res.json(users);
};
