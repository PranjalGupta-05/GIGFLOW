import { Response } from 'express';
import { Lead } from '../models/Lead';
import { AuthRequest, LeadFilters, LeadStatus, LeadSource } from '../types';

const buildQuery = (filters: LeadFilters) => {
  const query: Record<string, unknown> = {};

  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;

  if (filters.search) {
    const regex = new RegExp(filters.search.trim(), 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  return query;
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sortBy = '-createdAt',
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const filters: LeadFilters = {
      status: status as LeadStatus,
      source: source as LeadSource,
      search,
      sortBy: sortBy as '-createdAt' | 'createdAt',
    };

    const query = buildQuery(filters);
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sortBy).skip(skip).limit(limitNum).populate('createdBy', 'name email').lean(),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: leads,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch leads';
    res.status(500).json({ success: false, error: message });
  }
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email').lean();
    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch lead' });
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user?.id });
    res.status(201).json({ success: true, data: lead, message: 'Lead created successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create lead';
    res.status(400).json({ success: false, error: message });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }

    res.status(200).json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update lead';
    res.status(400).json({ success: false, error: message });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to delete lead' });
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query as Record<string, string>;
    const query = buildQuery({ status: status as LeadStatus, source: source as LeadSource, search });

    const leads = await Lead.find(query).lean();

    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
    const rows = leads.map((l) => [
      `"${l.name}"`,
      `"${l.email}"`,
      l.status,
      l.source,
      `"${l.notes || ''}"`,
      new Date(l.createdAt).toLocaleDateString('en-IN'),
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.status(200).send(csv);
  } catch {
    res.status(500).json({ success: false, error: 'CSV export failed' });
  }
};

export const getLeadStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Lead.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: { total, byStatus: statusStats, bySource: sourceStats },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};
