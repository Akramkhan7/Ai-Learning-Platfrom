import express, { Router } from 'express';
import { body } from 'express-validator';
import {register,login,getProfile,updateProfile,changePassword} from '../controller/authController';
import protect from '../middleware/auth';

const router = Router();

const registerValidation = [
    body('username')
    .trim()
    .isLength({min : 3})
    .withMessage('Username must be at least 3 characters'),

    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter valid email'),

    body('password')
    .isLength()
    .withMessage('Password must be at least 6 characters'),
];


const loginValidation = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter valid email'),

    body('password')
    .isLength()
    .withMessage('Password must be at least 6 characters'),
];

//Public Routes
router.post('/register', registerValidation, register);
router.post('/login',loginValidation, login);


//Protected routes

router.get('/profile', protect,getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password',protect,changePassword);


export default router;
