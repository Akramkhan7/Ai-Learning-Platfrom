import jwt from 'jsonwebtoken';
import User from '../models/User';


const auth = async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.spilit("")[1];
    }

};

export default auth;
