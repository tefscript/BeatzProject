import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { body, validationResult } from 'express-validator';

export const login = async (req, res) => {

  await body('email').isEmail().withMessage('Email invalido').run(req);
  await body('password').isLength({ min: 6 }).withMessage('Senha muito curta').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const { data: user, error } = await db.from('users').select('*').eq('email', email).maybeSingle();

  if (error || !user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

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

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
  if (!password) return res.status(400).json({ error: 'Senha é obrigatória' });
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

  const { data: existingUser, error: existingUserError } = await db.from('users').select('id').eq('email', email).maybeSingle();

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

export const socialLogin = async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

  // Verifica se o usuário já existe
  let { data: user, error } = await db.from('users').select('*').eq('email', email).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });

  // Se não existe, cria
  if (!user) {
    const { data: newUser, error: insertError } = await db
      .from('users')
      .insert([{ email, name, password_hash: '' }])
      .select()
      .maybeSingle();
    if (insertError || !newUser) {
      return res.status(500).json({ error: insertError?.message || 'Erro ao cadastrar usuário' });
    }
    user = newUser;
  }

  // Gera o token JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
};

export const logout = async (req, res) => {
  // Em uma implementação real, você poderia invalidar o token
  // Por enquanto, apenas retorna sucesso
  res.status(200).json({ 
    success: true, 
    message: 'Logout successful' 
  });
};

export const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  res.status(200).json({
    success: true,
    data: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    }
  });
};

export const updateProfile = async (req, res) => {
  await body('name').optional().isString().withMessage('Nome deve ser uma string').run(req);
  await body('email').optional().isEmail().withMessage('Email inválido').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  if (!req.user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  const { name, email } = req.body;
  const updateData = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No data to update'
    });
  }

  const { data: updatedUser, error } = await db
    .from('users')
    .update(updateData)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
};

export const changePassword = async (req, res) => {
  await body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória').run(req);
  await body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  if (!req.user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  const { currentPassword, newPassword } = req.body;

  // Verificar senha atual
  const passwordMatch = await bcrypt.compare(currentPassword, req.user.password_hash);
  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Hash da nova senha
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Atualizar senha
  const { error } = await db
    .from('users')
    .update({ password_hash: hashedNewPassword })
    .eq('id', req.user.id);

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
};
