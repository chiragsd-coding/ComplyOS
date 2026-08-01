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
import { getFinanceOverview, updateInvoiceStatus } from "~/lib/documents";
import { useAuth } from "~/lib/use-auth";

export const Route = createFileRoute("/finance")({
  component: FinancePage,
});

interface Invoice {
  id: string;
  vendor_name: string;
  amount: number;
  due_date: string;
  status: string;
  invoice_date: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

interface FinanceData {
  totalRevenue: number;
  unpaidTotal: number;
  unpaidCount: number;
  invoices: Invoice[];
  monthlyData: MonthlyData[];
}

function FinancePage() {
  const { user, loading: authLoading, handleLogout } = useAuth();
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getFinanceOverview({
        data: { userId: user!.id },
      });
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load finance data");
    } finally {
      setLoading(false);
    }
  }

  async function togglePaid(invoiceId: string, currentStatus: string) {
    const newStatus = currentStatus === "paid" ? "unpaid" : "paid";
    // Optimistic update
    setData((prev) => {
      if (!prev) return prev;
      const updated = prev.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv,
      );
      const paidInvoices = updated.filter((i) => i.status === "paid");
      const unpaidInvoices = updated.filter((i) => i.status !== "paid");
      return {
        ...prev,
        invoices: updated,
        totalRevenue: paidInvoices.reduce((sum, i) => sum + i.amount, 0),
        unpaidTotal: unpaidInvoices.reduce((sum, i) => sum + i.amount, 0),
        unpaidCount: unpaidInvoices.length,
      };
    });

    try {
      await updateInvoiceStatus({ data: { invoiceId, status: newStatus } });
    } catch {
      loadData(); // Revert on failure
    }
  }

  const maxRevenue = data
    ? Math.max(...data.monthlyData.map((m) => Math.max(m.revenue, m.expenses)), 1)
    : 1;

  if (authLoading) return <LoadingSpinner />;

  return (
    <DashboardLayout user={user!} onLogout={handleLogout}>
      <PageHeader
        title="Financial Dashboard"
        description="Revenue, invoices, and cash flow"
      />

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200/50">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Revenue"
              value={formatIndianCurrency(data.totalRevenue)}
              icon="📈"
              color="text-green-700"
            />
            <StatCard
              title="Unpaid Total"
              value={formatIndianCurrency(data.unpaidTotal)}
              icon="⚠️"
              color={data.unpaidTotal > 0 ? "text-red-600" : "text-gray-900"}
            />
            <StatCard
              title="Unpaid Invoices"
              value={data.unpaidCount}
              icon="📋"
              color={data.unpaidCount > 0 ? "text-yellow-600" : "text-gray-900"}
            />
          </div>

          {/* Monthly Revenue Chart */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Monthly Revenue
            </h3>
            <div className="space-y-3">
              {data.monthlyData.map((m) => (
                <div key={m.month} className="flex items-center gap-2">
                  <span className="w-10 text-xs font-medium text-gray-500">
                    {m.month}
                  </span>
                  <div className="flex flex-1 items-center gap-1">
                    <div className="group relative flex-1">
                      <div
                        className="h-6 rounded bg-brand-500 transition-all hover:bg-brand-600"
                        style={{
                          width: `${Math.max((m.revenue / maxRevenue) * 100, 2)}%`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-xs font-medium text-white drop-shadow-sm">
                          {formatIndianCurrency(m.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="group relative flex-1">
                      <div
                        className="h-6 rounded bg-red-300 transition-all hover:bg-red-400"
                        style={{
                          width: `${Math.max((m.expenses / maxRevenue) * 100, 2)}%`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-xs font-medium text-red-900/70">
                          {formatIndianCurrency(m.expenses)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-brand-500" />
                Revenue
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-red-300" />
                Expenses
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Invoices
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
                    <th className="px-5 py-3">Vendor</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Invoice Date</th>
                    <th className="px-5 py-3">Due Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-gray-50 transition-colors hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {inv.vendor_name}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {formatIndianCurrency(inv.amount)}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(inv.invoice_date).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(inv.due_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => togglePaid(inv.id, inv.status)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            inv.status === "paid"
                              ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {inv.status === "paid"
                            ? "Mark unpaid"
                            : "Mark paid"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </DashboardLayout>
  );
}
