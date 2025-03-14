import { slugify } from "../utils/format.js"
import { categoryModel } from "../models/categoryModel.js"
import { StatusCodes } from "http-status-codes"


const createNew = async (reqBody) => {
  try {
    const newCategory = {
      ...reqBody,
      slug: slugify(reqBody.categoryName),
    }

    //console.log("newCategory", newCategory)

    const createdCategory = await categoryModel.createNewCategory(newCategory)
    return createdCategory
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const getAll = async () => {
  try {
    const categories = await categoryModel.getAllCategory()
    return categories
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const deleteCategory = async (id) => {
  try {
    const deletedCategory = await categoryModel.deleteCategory(id)
    return deletedCategory
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const getCategoryById = async (id) => {
  try {
    const category = await categoryModel.getCategoryById(id)
    return category
  } catch (error) {
    throw new Error(error.message || error)
  }
}

const updateCategory = async (id, updatedCategory) => {
  try {
    const categoryUpdated = {
      ...updatedCategory,
      slug: slugify(updatedCategory.categoryName),
    }
    const category = await categoryModel.updateCategory(id, categoryUpdated)
    return categoryUpdated
  } catch (error) {
    throw new Error(error.message || error)
  }
}
//xoá category thì xoá cả sp trong đó

export const categoryService = {
  createNew,
  getAll,
  deleteCategory,
  getCategoryById,
  updateCategory
}