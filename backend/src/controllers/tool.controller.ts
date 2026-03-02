import { Response, NextFunction } from 'express';
import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTools = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Non authentifié', 401);
    }

    const result = await query(
      `SELECT id, name, category, monthly_cost, currency, licenses_total, 
              licenses_used, renewal_date, contract_type, status
       FROM saas_tools 
       WHERE company_id = $1 
       ORDER BY monthly_cost DESC`,
      [req.user.companyId]
    );

    res.status(200).json({
      tools: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

export const createTool = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Non authentifié', 401);
    }

    const {
      name,
      category,
      monthly_cost,
      currency = 'EUR',
      licenses_total,
      licenses_used = 0,
      renewal_date,
      contract_type = 'annual',
      status = 'active'
    } = req.body;

    if (!name || !category || !monthly_cost || !licenses_total || !renewal_date) {
      throw new AppError('Champs obligatoires manquants', 400);
    }

    if (licenses_used > licenses_total) {
      throw new AppError('Les licences utilisées ne peuvent pas dépasser le total', 400);
    }

    const result = await query(
      `INSERT INTO saas_tools (
        company_id, name, category, monthly_cost, currency, licenses_total, 
        licenses_used, renewal_date, contract_type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        req.user.companyId, name, category, monthly_cost, currency,
        licenses_total, licenses_used, renewal_date, contract_type, status
      ]
    );

    res.status(201).json({
      message: 'Outil créé avec succès',
      tool: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateTool = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Non authentifié', 401);
    }

    const { id } = req.params;
    const { name, category, monthly_cost, licenses_total, licenses_used, renewal_date, status } = req.body;

    const checkResult = await query(
      'SELECT id FROM saas_tools WHERE id = $1 AND company_id = $2',
      [id, req.user.companyId]
    );

    if (checkResult.rows.length === 0) {
      throw new AppError('Outil non trouvé', 404);
    }

    const result = await query(
      `UPDATE saas_tools 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           monthly_cost = COALESCE($3, monthly_cost),
           licenses_total = COALESCE($4, licenses_total),
           licenses_used = COALESCE($5, licenses_used),
           renewal_date = COALESCE($6, renewal_date),
           status = COALESCE($7, status)
       WHERE id = $8 AND company_id = $9
       RETURNING *`,
      [name, category, monthly_cost, licenses_total, licenses_used, renewal_date, status, id, req.user.companyId]
    );

    res.status(200).json({
      message: 'Outil mis à jour',
      tool: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTool = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Non authentifié', 401);
    }

    const { id } = req.params;

    const result = await query(
      'DELETE FROM saas_tools WHERE id = $1 AND company_id = $2 RETURNING id',
      [id, req.user.companyId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Outil non trouvé', 404);
    }

    res.status(200).json({
      message: 'Outil supprimé',
      id: result.rows[0].id
    });
  } catch (error) {
    next(error);
  }
};