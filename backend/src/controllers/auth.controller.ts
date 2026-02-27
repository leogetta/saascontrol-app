import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name, companyName, employeesCount } = req.body;

    if (!email || !password || !name || !companyName) {
      throw new AppError('Tous les champs sont requis', 400);
    }

    if (password.length < 8) {
      throw new AppError('Le mot de passe doit contenir au moins 8 caractères', 400);
    }

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new AppError('Cet email est déjà utilisé', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await query('BEGIN');

    try {
      const companyResult = await query(
        'INSERT INTO companies (name, employees_count) VALUES ($1, $2) RETURNING id, name',
        [companyName, employeesCount || 25]
      );
      const company = companyResult.rows[0];

      const userResult = await query(
        'INSERT INTO users (company_id, email, password, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role',
        [company.id, email, hashedPassword, name, 'admin']
      );
      const user = userResult.rows[0];

      await query('COMMIT');

      const token = jwt.sign(
        { userId: user.id, email: user.email, companyId: company.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'Compte créé avec succès',
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        company: { id: company.id, name: company.name }
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email et mot de passe requis', 400);
    }

    const result = await query(
      'SELECT u.id, u.email, u.password, u.name, u.role, u.company_id, c.name as company_name FROM users u JOIN companies c ON u.company_id = c.id WHERE u.email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, companyId: user.company_id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      company: { id: user.company_id, name: user.company_name }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Non authentifié', 401);
    }

    const result = await query(
      'SELECT u.id, u.email, u.name, u.role, u.company_id, c.name as company_name FROM users u JOIN companies c ON u.company_id = c.id WHERE u.id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    const user = result.rows[0];

    res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      company: { id: user.company_id, name: user.company_name }
    });
  } catch (error) {
    next(error);
  }
};