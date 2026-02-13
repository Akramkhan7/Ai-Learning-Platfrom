import jwt from "jsonwebtoken";
import User from "../models/User";
import { json } from "express";

//Generate token
const geneateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};


export const register = async (req, res, next) =>{
    try{

    }catch(err){
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







