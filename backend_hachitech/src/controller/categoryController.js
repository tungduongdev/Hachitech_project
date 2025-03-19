import { categoryService } from "../service/categoryService.js"
import { StatusCodes } from "http-status-codes"


const createNew = async (req, res, next) => {
  try {
    //dieu huong du lieu sang tang service
    const createNewCategory = await categoryService.createNew(req.body)
    //co ket qua thif tra ve phia client
    res.status(StatusCodes.CREATED).json(createNewCategory)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll()
    res.status(StatusCodes.OK).json(categories)
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const deleteCategory = await categoryService.deleteCategory(req.params.id)
    res.status(StatusCodes.OK).json(deleteCategory)
  } catch (error) {
    next(error)
  }
}

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id)
    res.status(StatusCodes.OK).json(category)
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const updateCategory = await categoryService.updateCategory(req.params.id, req.body)
    res.status(StatusCodes.OK).json(updateCategory)
  } catch (error) {
    next(error)
  }
}

const findCategoryByName = async (req, res, next) => {
  try {
    const category = await categoryService.findCategoryByName(req.params.name)
    res.status(StatusCodes.OK).json(category)
  } catch (error) {
    next(error)
  }
}

export const categoryController = {
  createNew,
  getAll,
  deleteCategory,
  getCategoryById,
  updateCategory,
  findCategoryByName
}