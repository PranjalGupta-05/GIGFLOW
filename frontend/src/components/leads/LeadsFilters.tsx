import { LeadFilters, LeadStatus, LeadSource } from '../../types';

interface Props {
  filters: LeadFilters;
  onFilterChange: (updates: Partial<LeadFilters>) => void;
  onExport: () => void;
  onAddLead: () => void;
}

const inputClass = 'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all';

export function LeadsFilters({ filters, onFilterChange, onExport, onAddLead }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="relative flex-1 min-w-0 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className={`${inputClass} w-full pl-9`}
          placeholder="Search by name or email..."
          value={filters.search ?? ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <select className={inputClass} value={filters.status ?? ''} onChange={(e) => onFilterChange({ status: e.target.value as LeadStatus | '' })}>
          <option value="">All Status</option>
          {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select className={inputClass} value={filters.source ?? ''} onChange={(e) => onFilterChange({ source: e.target.value as LeadSource | '' })}>
          <option value="">All Sources</option>
          {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select className={inputClass} value={filters.sortBy ?? '-createdAt'} onChange={(e) => onFilterChange({ sortBy: e.target.value as LeadFilters['sortBy'] })}>
          <option value="-createdAt">Latest First</option>
          <option value="createdAt">Oldest First</option>
        </select>

        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          title="Export CSV"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>

        <button
          onClick={onAddLead}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </button>
      </div>
    </div>
  );
}
