import prisma from '../prisma/client';

export const findAllUsers = () =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

export const findUserById = (id) =>
  prisma.user.findFirst({
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

export const findUserByEmail = (email) =>
  prisma.user.findFirst({
    where: {
      email,
    },
  });

export const createUser = (name, email, hashedPassword) =>
  prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

export const deleteUser = (user) =>
  prisma.user.delete({
    where: {
      id: user.id,
    },
  });

export const updateUser = (findUser, name, email, password, hashedPassword) =>
  prisma.user.update({
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
