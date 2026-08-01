import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  DashboardLayout,
  LoadingSpinner,
  PageHeader,
  StatusBadge,
} from "~/components/DashboardLayout";
import { getComplianceTasks, updateTaskStatus } from "~/lib/compliance";
import { useAuth } from "~/lib/use-auth";

export const Route = createFileRoute("/compliance")({
  component: CompliancePage,
});

const CATEGORIES = ["All", "GST", "TDS", "PF", "ESIC", "ROC", "IT"] as const;

interface Task {
  id: string;
  title: string;
  category: string;
  due_date: string;
  status: string;
}

function CompliancePage() {
  const { user, loading: authLoading, handleLogout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    loadTasks();
  }, [user, category]);

  async function loadTasks() {
    setLoading(true);
    try {
      const result = await getComplianceTasks({
        data: {
          userId: user!.id,
          category: category === "All" ? undefined : category,
        },
      });
      setTasks(result);
    } catch (err: any) {
      setError(err.message || "Failed to load compliance tasks");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );
    try {
      await updateTaskStatus({ data: { taskId, status: newStatus } });
    } catch {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: currentStatus } : t)),
      );
    }
  }

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-50 text-green-700 ring-green-200/50";
    if (status === "overdue") return "bg-red-50 text-red-700 ring-red-200/50";
    return "bg-yellow-50 text-yellow-700 ring-yellow-200/50";
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (authLoading) return <LoadingSpinner />;

  return (
    <DashboardLayout user={user!} onLogout={handleLogout}>
      <PageHeader
        title="Compliance Calendar"
        description="Track all your statutory deadlines in one place"
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200/50">
          {error}
        </div>
      )}

      {/* Category filter buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              category === cat
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <span className="text-4xl">🎉</span>
          <p className="mt-3 text-sm font-medium text-gray-900">All clear!</p>
          <p className="mt-1 text-sm text-gray-500">
            No tasks in this category. Switch to another category or enjoy the peace.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => toggleTask(task.id, task.status)}
                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      task.status === "completed"
                        ? "text-gray-400 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {task.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      Due {formatDate(task.due_date)}
                    </span>
                  </div>
                </div>
                <StatusBadge status={task.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
}
