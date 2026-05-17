import { LeadStatus } from '../../types';

interface Props {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

const config: Record<LeadStatus, { bg: string; text: string; dot: string; label: string }> = {
  New: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500', label: 'New' },
  Contacted: { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500', label: 'Contacted' },
  Qualified: { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', label: 'Qualified' },
  Lost: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-400', label: 'Lost' },
};

export function StatusBadge({ status, size = 'sm' }: Props) {
  const c = config[status];
  const padding = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${padding}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
