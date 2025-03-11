import bcrypt from "bcrypt";
import Joi from "joi";
import { GET_DB } from "../configs/mongodb.js";

const userRole = {
    ADMIN: "admin",
    USER: "user"
}

// Tên collection
const userCollection = "User";

// Định nghĩa schema validation bằng Joi
const userValidationSchema = Joi.object({
    username: Joi.string().required().lowercase().trim(),
    password: Joi.string().required(),
    verifyToken: Joi.string().default(null),
    isActive: Joi.boolean().default(false),
    role: Joi.string().valid(userRole.ADMIN, userRole.USER).default(userRole.USER),
    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null)
});

// Lấy tất cả user
const getAllsUser = async () => {
    try {
        const result = await GET_DB().collection(userCollection).find().toArray()
        return result
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`)
    }
};

// Tạo user mới
const createNew = async (newUser) => {
    try {
        console.log(newUser.username)

        if (![userRole.ADMIN, userRole.USER].includes(newUser.role)) {
            newUser.role = userRole.USER;
        }
        // Validate dữ liệu bằng Joi
        const userData = {
            username: newUser.username,
            password: newUser.password,
            role: newUser.role || userRole.USER,
            createdAt: Date.now(),
        };
        const { error } = userValidationSchema.validate(userData)
        if (error) throw new Error(`Validation error: ${error.details[0].message}`)

        // Kiểm tra username trùng
        const existingUser = await GET_DB().collection(userCollection).findOne( { username: userData.username } )
        if (existingUser) throw new Error("Username already exists")

        // Hash password
        const hashedPassword = await bcrypt.hash(newUser.password, 10)
        userData.password = hashedPassword

        // Chèn user vào collection
        const result = await GET_DB().collection(userCollection).insertOne(userData)
        return { _id: result.insertedId, ...userData }
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`)
    }
}

// Tìm user theo username
const findByName = async (username) => {
    try {
        const result = await GET_DB().collection(userCollection).findOne({ username })
        return result;
    } catch (error) {
        throw new Error(`Error finding user: ${error.message}`)
    }
}

const findById = async (id) => {
    try {
        const result = await GET_DB().collection(userCollection).findOne({ _id: id })
        return result;
    } catch (error) {
        throw new Error(`Error finding user: ${error.message}`)
    }
}
// Export các hàm
export const userModel = {
    getAllsUser,
    createNew,
    findByName,
    findById
}