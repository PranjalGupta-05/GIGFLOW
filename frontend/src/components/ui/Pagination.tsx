import { PaginationMeta } from '../../types';

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: Props) {
  if (meta.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btnBase = 'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors';
  const activeBtn = `${btnBase} bg-brand-600 text-white`;
  const inactiveBtn = `${btnBase} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`;
  const disabledBtn = `${btnBase} text-gray-300 dark:text-gray-700 cursor-not-allowed`;

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400">
        Showing <span className="font-medium text-gray-600 dark:text-gray-300">{from}–{to}</span> of{' '}
        <span className="font-medium text-gray-600 dark:text-gray-300">{total}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!meta.hasPrevPage}
          className={meta.hasPrevPage ? inactiveBtn : disabledBtn}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400">…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p)} className={p === page ? activeBtn : inactiveBtn}>
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!meta.hasNextPage}
          className={meta.hasNextPage ? inactiveBtn : disabledBtn}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
