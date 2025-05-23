import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { body } from 'express-validator';

export const login = async (req, res) => {

  await body('email').isEmail().withMessage('Email invalido').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Senha muito curta').run(req);

  const validationError = checkValidationErrors(req, res);
  if (validationError) return validationError;

  const { email, password } = req.body;

  const { data: user, error } = await db.from('users').select('*').eq('email', email).single();

  if (error || !user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, user: { id: user.id, email: user.email } });
};

export const register = async (req, res) => {

  await body('email').isEmail().withMessage('Email inválidoo').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Senha muito curta')
    .matches(/[0-9]/).withMessage('Senha deve conter pelo menos um número')
    .matches(/[a-zA-Z]/)
    .withMessage('A senha deve conter pelo menos uma letra')
    .run(req);

  await body('name').notEmpty().withMessage('Nome é obrigatório').run(req);

  const validationError = checkValidationErrors(req, res);
  if(validationError) return validationError;

  const { name, email, password } = req.body;

  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
  if (!password) return res.status(400).json({ error: 'Senha é obrigatória' });
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  const { data: existingUser, error: existingUserError } = await db.from('users').select('id').eq('email', email).single();

  if (existingUserError) {
    return res.status(500).json({ error: existingUserError.message });
  }

  if (existingUser) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: newUser, error: insertError } = await db
    .from('users')
    .insert([{ email, password_hash: hashedPassword, name }])
    .select()
    .maybeSingle();

  if (insertError || !newUser) {
    return res.status(500).json({ error: insertError?.message || 'Erro ao cadastrar usuário' });
  }

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
};
