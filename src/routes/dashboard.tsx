import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  DashboardLayout,
  LoadingSpinner,
  PageHeader,
  StatCard,
  StatusBadge,
  formatIndianCurrency,
} from "~/components/DashboardLayout";
import { getDashboardStats } from "~/lib/compliance";
import { useAuth } from "~/lib/use-auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

interface Stats {
  upcomingCount: number;
  overdueCount: number;
  pendingInvoiceCount: number;
  docCount: number;
  nextDeadlines: Array<{
    id: string;
    title: string;
    category: string;
    due_date: string;
    status: string;
  }>;
  recentInvoices: Array<{
    id: string;
    vendor_name: string;
    amount: number;
    due_date: string;
    status: string;
  }>;
}

function DashboardPage() {
  const { user, loading: authLoading, handleLogout } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getDashboardStats({ data: { userId: user.id } })
      .then((s) => {
        setStats(s);
        setStatsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard");
        setStatsLoading(false);
      });
  }, [user]);

  if (authLoading) return <LoadingSpinner />;

  return (
    <DashboardLayout user={user!} onLogout={handleLogout}>
      <PageHeader
        title={`Welcome back, ${user!.company_name}`}
        description="Your business at a glance"
      />

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200/50">
          {error}
        </div>
      )}

      {statsLoading ? (
        <LoadingSpinner />
      ) : stats ? (
        <>
          {/* Stat Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Upcoming Deadlines"
              value={stats.upcomingCount}
              icon="📅"
              color="text-brand-700"
            />
            <StatCard
              title="Overdue Tasks"
              value={stats.overdueCount}
              icon="⚠️"
              color={stats.overdueCount > 0 ? "text-red-600" : "text-gray-900"}
            />
            <StatCard
              title="Pending Invoices"
              value={stats.pendingInvoiceCount}
              icon="💰"
              color={stats.pendingInvoiceCount > 0 ? "text-yellow-600" : "text-gray-900"}
            />
            <StatCard
              title="Documents Processed"
              value={stats.docCount}
              icon="📄"
              color="text-gray-900"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Next 5 Deadlines */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Next 5 Deadlines
              </h3>
              {stats.nextDeadlines.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming deadlines 🎉</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {stats.nextDeadlines.map((task) => (
                    <li key={task.id} className="flex items-center justify-between py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {task.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {task.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            Due {new Date(task.due_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={task.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Invoices */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Recent Invoices
              </h3>
              {stats.recentInvoices.length === 0 ? (
                <p className="text-sm text-gray-500">No invoices yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-medium text-gray-500">
                        <th className="pb-2 pr-3">Vendor</th>
                        <th className="pb-2 pr-3">Amount</th>
                        <th className="pb-2 pr-3">Due Date</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentInvoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 pr-3 font-medium text-gray-900">
                            {inv.vendor_name}
                          </td>
                          <td className="py-2.5 pr-3 text-gray-700">
                            {formatIndianCurrency(inv.amount)}
                          </td>
                          <td className="py-2.5 pr-3 text-gray-500">
                            {new Date(inv.due_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>
                          <td className="py-2.5">
                            <StatusBadge status={inv.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </DashboardLayout>
  );
}
