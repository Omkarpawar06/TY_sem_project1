import express from 'express';
import { handleUserLogin, handleUserSignup, getUsers, } from '../controllers/UserController.js';

const router = express.Router();

router.post('/login', handleUserLogin);
router.post('/signup', handleUserSignup);
router.get('/getUsers', getUsers);


export default router;
