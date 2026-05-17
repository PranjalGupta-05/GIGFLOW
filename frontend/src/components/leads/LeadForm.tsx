import { useState, FormEvent } from 'react';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '../../types';
import { leadsService } from '../../services/leads';
import toast from 'react-hot-toast';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  existing?: Lead;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const inputClass =
  'w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all';

export function LeadForm({ onSuccess, onClose, existing }: Props) {
  const [form, setForm] = useState<LeadFormData>({
    name: existing?.name ?? '',
    email: existing?.email ?? '',
    status: existing?.status ?? 'New',
    source: existing?.source ?? 'Website',
    notes: existing?.notes ?? '',
  });
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: Partial<LeadFormData> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Enter a valid email address';
    if (!form.source) e.source = 'Please select a source';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (existing) {
        await leadsService.update(existing._id, form);
        toast.success('Lead updated successfully');
      } else {
        await leadsService.create(form);
        toast.success('Lead created successfully');
      }
      onSuccess();
      onClose();
    } catch {
      toast.error(existing ? 'Failed to update lead' : 'Failed to create lead');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof LeadFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Full Name</label>
        <input className={inputClass} placeholder="Rahul Sharma" value={form.name} onChange={(e) => field('name', e.target.value)} />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email Address</label>
        <input className={inputClass} type="email" placeholder="rahul@example.com" value={form.email} onChange={(e) => field('email', e.target.value)} />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Status</label>
          <select className={inputClass} value={form.status} onChange={(e) => field('status', e.target.value as LeadStatus)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Source</label>
          <select className={inputClass} value={form.source} onChange={(e) => field('source', e.target.value as LeadSource)}>
            {SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Notes <span className="text-gray-400">(optional)</span></label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Any additional context about this lead..."
          value={form.notes}
          onChange={(e) => field('notes', e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Saving...' : existing ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
