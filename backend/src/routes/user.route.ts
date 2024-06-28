import express from 'express';

import { userController } from '../controllers/user.controller';

const router = express.Router();

router
  .post('/signup', userController.createUser)

  .post('/login', userController.login);

export default router;
