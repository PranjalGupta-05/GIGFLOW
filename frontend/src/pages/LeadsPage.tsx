import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { LeadsFilters } from '../components/leads/LeadsFilters';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Lead } from '../types';
import { leadsService } from '../services/leads';

export function LeadsPage() {
  const { leads, meta, isLoading, filters, updateFilter, setPage, deleteLead, refetch } = useLeads();

  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteLead(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleExport = () => {
    leadsService.exportCSV(filters);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {meta ? `${meta.total} total leads` : 'Manage your pipeline'}
          </p>
        </div>
      </div>

      <LeadsFilters
        filters={filters}
        onFilterChange={updateFilter}
        onExport={handleExport}
        onAddLead={() => setCreateOpen(true)}
      />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          onEdit={(lead) => setEditLead(lead)}
          onDelete={handleDelete}
          onView={(lead) => setViewLead(lead)}
        />

        {meta && meta.totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New Lead">
        <LeadForm onSuccess={refetch} onClose={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm existing={editLead} onSuccess={refetch} onClose={() => setEditLead(null)} />
        )}
      </Modal>

      {/* View modal */}
      <Modal isOpen={!!viewLead} onClose={() => setViewLead(null)} title="Lead Details" size="sm">
        {viewLead && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-lg">
                {viewLead.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{viewLead.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{viewLead.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <StatusBadge status={viewLead.status} size="md" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Source</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{viewLead.source}</p>
              </div>
            </div>

            {viewLead.notes && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{viewLead.notes}</p>
              </div>
            )}

            <p className="text-xs text-gray-400">
              Added {new Date(viewLead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <button
              onClick={() => { setViewLead(null); setEditLead(viewLead); }}
              className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              Edit Lead
            </button>
          </div>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Lead" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this lead? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
