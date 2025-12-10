import express from 'express';
import { loginController } from '../controllers/AuthController.js';
const router = express.Router();

router.post('/login', loginController);

router.options('/login', (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.status(204).send();
});

export default router;
