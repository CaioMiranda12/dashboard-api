import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import * as CategoryModel from '../models/categoryModel';

export const getAllUserCategories = async (req, res) => {
  try {
    const { userId } = req;

    const categories = await CategoryModel.findUserCategoriesById(userId);

    return res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Erro ao buscar categorias' });
  }
};

export const createCategory = async (req, res) => {
  const schema = yup.object({
    name: yup.string().required(),
    color: yup
      .string()
      .required()
      .matches(
        /^#(?:[0-9a-fA-F]{3}){1,2}$/,
        'Cor inválida. Use um valor hexadecimal, como #RRGGBB',
      ),
  });

  try {
    const { userId } = req;
    const { name, color } = req.body;

    schema.validateSync(req.body, { abortEarly: false });

    const categoryExists = await CategoryModel.findUserCategoriesByName(
      userId,
      name,
    );

    if (categoryExists) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Já existe uma categoria com esse nome' });
    }

    const category = await CategoryModel.createUserCategory(
      name,
      color,
      userId,
    );

    return res.status(StatusCodes.CREATED).json(category);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.errors || 'Erro ao criar nova categoria' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const category = await CategoryModel.getUserCategoryById(userId, id);

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Categoria não encontrada' });
    }

    const transactionsWithCategory =
      await CategoryModel.findTransactionsWithCategoryId(id);

    if (transactionsWithCategory) {
      return res
        .status(400)
        .json({ error: 'Categoria em uso por transações.' });
    }

    await CategoryModel.deleteCategory(userId, category);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Categoria deletada com sucesso!' });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Erro ao deletar categoria' });
  }
};

export const updateCategory = async (req, res) => {
  const scheme = yup.object({
    name: yup.string(),
    color: yup
      .string()
      .matches(
        /^#(?:[0-9a-fA-F]{3}){1,2}$/,
        'Cor inválida. Use um valor hexadecimal, como #RRGGBB',
      ),
  });

  try {
    const { userId } = req;
    const { name, color } = req.body;
    const { id } = req.params;

    scheme.validateSync(req.body, { abortEarly: false });

    const category = await CategoryModel.getUserCategoryById(userId, id);

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'Categoria não encontrada' });
    }

    const nameExists = await CategoryModel.getUserCategoryByName(userId, name);

    if (nameExists && category.name !== name) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Já existe uma categoria com esse nome' });
    }

    const updatedCategory = await CategoryModel.updateCategory(
      category,
      name,
      color,
    );

    return res.status(StatusCodes.OK).json(updatedCategory);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.errors || 'Falha ao atualizar categoria' });
  }
};
