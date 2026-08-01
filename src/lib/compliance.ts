import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";

import { sql, initSchema } from "./db";

function generateId(): string {
  return crypto.randomUUID();
}

type Category = "GST" | "TDS" | "PF" | "ESIC" | "ROC" | "IT" | "ISO";

interface ComplianceRow {
  id: string;
  user_id: string;
  title: string;
  category: string;
  due_date: string;
  status: string;
  reminder_enabled: number;
  created_at: string;
}

export const seedComplianceTasks = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const { userId } = data as { userId: string };
    if (!userId) throw new Error("User ID required");
    return { userId };
  })
  .handler(async ({ data }) => {
    await initSchema();

    const result = await sql`SELECT COUNT(*) as count FROM compliance_tasks WHERE user_id = ${data.userId}`;
    const existing = result[0] as { count: number };
    if (existing.count > 0) return { seeded: existing.count };

    const now = new Date();
    const months = [now.getMonth() + 1];

    interface DeadlineDef {
      title: string;
      category: Category;
      day: number;
      month: number;
    }

    const allDeadlines: DeadlineDef[] = [];

    // Monthly deadlines
    const monthlyDeadlines: { title: string; category: Category; day: number }[] = [
      { title: "GST GSTR-3B Filing", category: "GST", day: 20 },
      { title: "GST GSTR-1 Filing", category: "GST", day: 11 },
      { title: "PF ECR Filing", category: "PF", day: 15 },
      { title: "ESIC Filing", category: "ESIC", day: 15 },
      { title: "Professional Tax Filing", category: "TDS", day: 15 },
    ];

    for (const month of months) {
      for (const d of monthlyDeadlines) {
        allDeadlines.push({ ...d, month: month > 12 ? month - 12 : month });
      }
    }

    // Quarterly deadlines
    const quarterlyDeadlines: { title: string; category: Category; day: number; months: number[] }[] = [
      { title: "TDS Return (Form 24Q)", category: "TDS", day: 31, months: [1, 4, 7, 10] },
    ];

    for (const d of quarterlyDeadlines) {
      const currentMonth = now.getMonth() + 1;
      const nextQMonth = d.months.find((m) => m >= currentMonth) || d.months[0];
      allDeadlines.push({ title: d.title, category: d.category, day: d.day, month: nextQMonth! });
    }

    // Yearly deadlines
    const yearlyDeadlines: { title: string; category: Category; month: number; day: number }[] = [
      { title: "ROC Annual Return", category: "ROC", month: 10, day: 29 },
      { title: "Income Tax Return (Non-Audit)", category: "IT", month: 7, day: 31 },
      { title: "Income Tax Return (Audit)", category: "IT", month: 10, day: 31 },
    ];

    for (const d of yearlyDeadlines) {
      allDeadlines.push({ title: d.title, category: d.category, day: d.day, month: d.month });
    }

    for (const d of allDeadlines) {
      const year = d.month < (now.getMonth() + 1) ? now.getFullYear() + 1 : now.getFullYear();
      const dueDate = new Date(year, d.month - 1, d.day).toISOString().split("T")[0];
      await sql`INSERT INTO compliance_tasks (id, user_id, title, category, due_date, status)
        VALUES (${generateId()}, ${data.userId}, ${d.title}, ${d.category}, ${dueDate}, 'pending')`;
    }

    return { seeded: allDeadlines.length };
  });

export const getComplianceTasks = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const { userId, category } = data as { userId: string; category?: string };
    if (!userId) throw new Error("User ID required");
    return { userId, category };
  })
  .handler(async ({ data }) => {
    await initSchema();
    let rows: ComplianceRow[];
    if (data.category && data.category !== "all") {
      rows = await sql`SELECT * FROM compliance_tasks WHERE user_id = ${data.userId} AND category = ${data.category} ORDER BY due_date ASC` as ComplianceRow[];
    } else {
      rows = await sql`SELECT * FROM compliance_tasks WHERE user_id = ${data.userId} ORDER BY due_date ASC` as ComplianceRow[];
    }
    return rows.map(formatTask);
  });

export const updateTaskStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const { taskId, status } = data as { taskId: string; status: string };
    if (!taskId || !status) throw new Error("Task ID and status required");
    return { taskId, status };
  })
  .handler(async ({ data }) => {
    await initSchema();
    await sql`UPDATE compliance_tasks SET status = ${data.status} WHERE id = ${data.taskId}`;
    return { success: true };
  });

export const getDashboardStats = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const { userId } = data as { userId: string };
    if (!userId) throw new Error("User ID required");
    return { userId };
  })
  .handler(async ({ data }) => {
    await initSchema();

    const upcomingResult = await sql`
      SELECT COUNT(*) as count FROM compliance_tasks
      WHERE user_id = ${data.userId} AND status = 'pending' AND due_date::date >= CURRENT_DATE
    `;
    const upcoming = upcomingResult[0] as { count: number };

    const overdueResult = await sql`
      SELECT COUNT(*) as count FROM compliance_tasks
      WHERE user_id = ${data.userId} AND status = 'pending' AND due_date::date < CURRENT_DATE
    `;
    const overdue = overdueResult[0] as { count: number };

    const pendingInvoicesResult = await sql`
      SELECT COUNT(*) as count FROM invoices
      WHERE user_id = ${data.userId} AND status IN ('unpaid', 'overdue')
    `;
    const pendingInvoices = pendingInvoicesResult[0] as { count: number };

    const docCountResult = await sql`SELECT COUNT(*) as count FROM documents WHERE user_id = ${data.userId}`;
    const docCount = docCountResult[0] as { count: number };

    const nextDeadlines = await sql`
      SELECT * FROM compliance_tasks
      WHERE user_id = ${data.userId} AND status = 'pending'
      ORDER BY due_date ASC LIMIT 5
    ` as ComplianceRow[];

    const recentInvoices = await sql`
      SELECT * FROM invoices WHERE user_id = ${data.userId} ORDER BY created_at DESC LIMIT 5
    ` as any[];

    return {
      upcomingCount: upcoming.count,
      overdueCount: overdue.count,
      pendingInvoiceCount: pendingInvoices.count,
      docCount: docCount.count,
      nextDeadlines: nextDeadlines.map(formatTask),
      recentInvoices: recentInvoices.map((inv) => ({
        ...inv,
        amount: Number(inv.amount),
      })),
    };
  });

function formatTask(t: ComplianceRow) {
  return {
    id: t.id,
    user_id: t.user_id,
    title: t.title,
    category: t.category,
    due_date: t.due_date,
    status: t.status,
    reminder_enabled: t.reminder_enabled,
    created_at: t.created_at,
  };
}
