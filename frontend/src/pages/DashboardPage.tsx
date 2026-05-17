import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { leadsService } from '../services/leads';

interface Stats {
  total: number;
  byStatus: { _id: string; count: number }[];
  bySource: { _id: string; count: number }[];
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
  Contacted: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
  Qualified: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
  Lost: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
};

export function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    leadsService.getStats()
      .then(setStats)
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, []);

  const qualified = stats?.byStatus.find((s) => s._id === 'Qualified')?.count ?? 0;
  const conversionRate = stats?.total ? Math.round((qualified / stats.total) * 100) : 0;

  const metricCards = [
    { label: 'Total Leads', value: stats?.total ?? 0, icon: '👥', color: 'bg-brand-50 dark:bg-brand-950' },
    { label: 'Qualified', value: qualified, icon: '✅', color: 'bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: '📈', color: 'bg-amber-50 dark:bg-amber-950' },
    { label: 'Sources', value: stats?.bySource.length ?? 0, icon: '🌐', color: 'bg-purple-50 dark:bg-purple-950' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto bg-gradient-to-br from-blue-100 via-gray-100 to-blue-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your leads today.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, icon, color }) => (
          <div key={label} className={`${color} rounded-2xl p-5`}>
            <span className="text-2xl">{icon}</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
              {isLoading ? <span className="block h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /> : value}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Leads by Status</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {(['New', 'Contacted', 'Qualified', 'Lost'] as const).map((status) => {
                const count = stats?.byStatus.find((s) => s._id === status)?.count ?? 0;
                const pct = stats?.total ? (count / stats.total) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status]} w-20 text-center flex-shrink-0`}>
                      {status}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Source breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Leads by Source</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(['Website', 'Instagram', 'Referral'] as const).map((source) => {
                const count = stats?.bySource.find((s) => s._id === source)?.count ?? 0;
                const icons: Record<string, string> = { Website: '🌐', Instagram: '📸', Referral: '👥' };
                return (
                  <div key={source} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{icons[source]} {source}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/leads"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          View All Leads
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
