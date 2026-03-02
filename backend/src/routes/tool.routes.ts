import { Router } from 'express';
import { 
  getTools, 
  createTool, 
  updateTool, 
  deleteTool 
} from '../controllers/tool.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes nécessitent authentification
router.use(authMiddleware);

/**
 * @route   GET /api/tools
 * @desc    Get all tools for user's company
 * @access  Private
 */
router.get('/', getTools);

/**
 * @route   POST /api/tools
 * @desc    Create a new SaaS tool
 * @access  Private
 */
router.post('/', createTool);

/**
 * @route   PUT /api/tools/:id
 * @desc    Update a SaaS tool
 * @access  Private
 */
router.put('/:id', updateTool);

/**
 * @route   DELETE /api/tools/:id
 * @desc    Delete a SaaS tool
 * @access  Private
 */
router.delete('/:id', deleteTool);

export default router;