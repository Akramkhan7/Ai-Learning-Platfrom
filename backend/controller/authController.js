import jwt from "jsonwebtoken";
import User from '../models/User.js';

// Generate Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create User
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate Token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "User registered successfully",
    });

  } catch (err) {
    next(err);
  }
};



export const login = async (req, res, next) =>{
    try{

    }catch(err){
        next(err);
    }
};



export const getProfile = async (req, res, next) =>{
    try{

    }catch(err){
        next(err);
    }
};



export const updateProfile = async (req, res, next) =>{
    try{

    }catch(err){
        next(err);
    }
};



export const changePassword = async (req, res, next) =>{
    try{

    }catch(err){
        next(err);
    }
};







