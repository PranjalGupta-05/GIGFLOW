import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadsController';
import { protect, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/errorHandler';

const router = Router();

router.use(protect);

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Valid source required'),
  body('notes').optional().isLength({ max: 500 }),
];

router.get('/', getLeads);
router.get('/export/csv', exportLeadsCSV);
router.get('/stats', getLeadStats);
router.get('/:id', getLead);
router.post('/', leadValidation, validateRequest, createLead);
router.patch('/:id', leadValidation.map((v) => v.optional()), validateRequest, updateLead);
router.delete('/:id', requireRole('Admin'), deleteLead);

export default router;
