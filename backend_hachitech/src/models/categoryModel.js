import Joi from "joi";
import { GET_DB } from "../configs/mongodb.js";
import { ObjectId } from "mongodb";

// Tên collection
const categoryCollection = "Categories";

// Định nghĩa schema validation bằng Joi
const categoryValidationSchema = Joi.object({
  categoryName: Joi.string().required().lowercase().trim(),
  isActive: Joi.boolean().default(true),
  description: Joi.string().allow("", null),
  parentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(null),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null)
});

const getAllCategory = async () => {
  try {
    const result = await GET_DB().collection(categoryCollection).aggregate([
      {
        $lookup: {
          from: "Products", // Đảm bảo tên collection sản phẩm chính xác (thường là 'products')
          let: { categoryId: "$_id" }, // Định nghĩa biến categoryId từ _id của danh mục
          pipeline: [
            {
              $match: {
                $and: [
                  { categoryId: { $exists: true } }, // Đảm bảo categoryId tồn tại
                  { categoryId: { $type: "array" } }, // Đảm bảo categoryId là mảng
                  {
                    $expr: {
                      $in: ["$$categoryId", "$categoryId"] // Kiểm tra $$categoryId có trong $categoryId
                    }
                  }
                ]
              }
            }
          ],
          as: "Products"
        }
      },
      {
        $project: {
          categoryName: 1, // Chỉ lấy tên danh mục
          description: 1, // Chỉ lấy mô tả
          slug: 1, // Chỉ lấy slug
          productCount: { $size: "$Products" } // Đếm số sản phẩm thuộc danh mục
        }
      }
    ]).toArray();

    // Kiểm tra nếu không có danh mục nào
    if (!result || result.length === 0) {
      console.warn('No categories found in the database.');
      return []; // Trả về mảng rỗng để frontend dễ xử lý
    }

    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

const createNewCategory = async (newCategory) => {
  try {
    const categoryData = {
      categoryName: newCategory.categoryName,
      description: newCategory.description,
      parentId: newCategory.parentId,
      isActive: true,
      createdAt: Date.now(),
    }

    console.log("newProduct model", newCategory)
    const { error } = categoryValidationSchema.validate(categoryData)
    if (error) throw new Error(`Validation error: ${error.details[0].message}`)

    const existingCategory = await GET_DB().collection(categoryCollection).findOne({ categoryName: categoryData.categoryName })
    if (existingCategory) throw new Error("Category already exists")

    const result = await GET_DB().collection(categoryCollection).insertOne(categoryData)
    return { _id: result.insertedId, ...categoryData }
  } catch (error) {
    throw new Error(`Error creating product: ${error.message}`)
  }
}

const deleteCategory = async (id) => {
  try {
    const category = await GET_DB()
      .collection(categoryCollection)
      .findOne({ _id: new ObjectId(id) });
    if (!category) {
      throw new Error("Category not found");
    }

    const deleteProducts = await GET_DB().collection("Products").deleteMany({ category: new ObjectId(id) })
    console.log("deleteProducts", deleteProducts)
    const result = await GET_DB().collection(categoryCollection).deleteOne({ _id: new ObjectId(id) })
    return { message : "Category and its products deleted" }
  } catch (error) {
    throw new Error(`Error deleting product: ${error.message}`)
  }
}

const getCategoryById = async (id) => {
  try {
    const category = await GET_DB().collection(categoryCollection).findOne({ _id: new ObjectId(id) })
    return category
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`)
  }
}

const updateCategory = async (id, updatedCategory) => {
  try {
    const category = await GET_DB().collection(categoryCollection).updateOne({ _id: new ObjectId(id) }, { $set: updatedCategory })
    return category
  } catch (error) {
    throw new Error(`Error updating product: ${error.message}`)
  }
}

const findCategoryByName = async (name) => {
  try {
    const category = await GET_DB().collection(categoryCollection).findOne({ categoryName: name })
    return category
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`)
  }
}
export const categoryModel = {
  getAllCategory,
  createNewCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
  findCategoryByName
}