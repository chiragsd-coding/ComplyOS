import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";

import { getDb } from "./db";

function generateId(): string {
  return crypto.randomUUID();
}

const EXTRACTION_TEMPLATES: Record<string, Record<string, string>> = {
  invoice: {
    vendor_name: "TechCorp Solutions Pvt Ltd",
    invoice_number: "INV-2026-0042",
    invoice_date: "2026-07-15",
    amount: "₹1,42,500",
    gst_number: "27AABCT1234C1Z5",
    due_date: "2026-08-14",
    items: "Software Development Services",
  },
  contract: {
    parties: "Acme Corp & TechCorp Solutions",
    contract_date: "2026-06-01",
    contract_value: "₹12,50,000",
    duration: "12 months",
    notice_period: "30 days",
    governing_law: "India",
  },
  gst: {
    gstin: "27AABCT1234C1Z5",
    return_period: "June 2026",
    filing_date: "2026-07-20",
    total_tax_liability: "₹2,85,000",
    itc_claimed: "₹1,45,000",
    net_payable: "₹1,40,000",
    status: "Filed",
  },
  pan: {
    pan_number: "AABCT1234C",
    full_name: "Ramesh Kumar Sharma",
    date_of_birth: "1985-03-15",
    father_name: "Suresh Kumar Sharma",
    status: "Valid",
  },
  purchase_order: {
    po_number: "PO-2026-089",
    vendor: "SupplyChain India Ltd",
    order_date: "2026-07-10",
    total_amount: "₹3,75,000",
    item_count: "150 units",
    delivery_date: "2026-08-20",
    payment_terms: "Net 45",
  },
  salary_slip: {
    employee_name: "Priya Patel",
    employee_id: "EMP-042",
    month: "June 2026",
    gross_pay: "₹85,000",
    deductions: "₹18,500",
    net_pay: "₹66,500",
    pf_deduction: "₹4,250",
    tax_deduction: "₹8,500",
  },
};

export const uploadDocument = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { userId: string; filename: string; fileType: string };
    if (!d.userId || !d.filename || !d.fileType) throw new Error("Missing required fields");
    return d;
  })
  .handler(async ({ data }) => {
    const db = getDb();
    const id = generateId();
    const mockExtraction = EXTRACTION_TEMPLATES[data.fileType] || { note: "Processing..." };

    db.query(
      `INSERT INTO documents (id, user_id, filename, file_type, extracted_data)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(id, data.userId, data.filename, data.fileType, JSON.stringify(mockExtraction));

    return { id, extracted_data: mockExtraction };
  });

export const getDocuments = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const { userId, search } = data as { userId: string; search?: string };
    if (!userId) throw new Error("User ID required");
    return { userId, search };
  })
  .handler(async ({ data }) => {
    const db = getDb();
    let rows: any[];
    if (data.search) {
      const q = db.query(
        `SELECT * FROM documents
         WHERE user_id = ? AND (filename LIKE ? OR file_type LIKE ?)
         ORDER BY upload_date DESC`,
      );
      rows = q.all(data.userId, `%${data.search}%`, `%${data.search}%`);
    } else {
      const q = db.query("SELECT * FROM documents WHERE user_id = ? ORDER BY upload_date DESC");
      rows = q.all(data.userId);
    }
    return rows.map((r: any) => ({
      ...r,
      extracted_data: JSON.parse(r.extracted_data || "{}"),
    }));
  });

export const getInvoices = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const { userId } = data as { userId: string };
    if (!userId) throw new Error("User ID required");
    return { userId };
  })
  .handler(async ({ data }) => {
    const db = getDb();
    const q = db.query("SELECT * FROM invoices WHERE user_id = ? ORDER BY due_date ASC");
    const rows = q.all(data.userId) as any[];
    return rows.map((r) => ({ ...r, amount: Number(r.amount) }));
  });

export const updateInvoiceStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const { invoiceId, status } = data as { invoiceId: string; status: string };
    if (!invoiceId || !status) throw new Error("Missing fields");
    return { invoiceId, status };
  })
  .handler(async ({ data }) => {
    const db = getDb();
    db.query("UPDATE invoices SET status = ? WHERE id = ?").run(data.status, data.invoiceId);
    return { success: true };
  });

export const getFinanceOverview = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const { userId } = data as { userId: string };
    if (!userId) throw new Error("User ID required");
    return { userId };
  })
  .handler(async ({ data }) => {
    const db = getDb();

    // Check if we need to seed mock data
    const count = db.query("SELECT COUNT(*) as count FROM invoices WHERE user_id = ?").get(data.userId) as { count: number };

    if (count.count === 0) {
      const mockInvoices = [
        { vendor: "Cloud Services Inc", amount: 45000, due: "2026-08-15", inv_date: "2026-07-01", status: "unpaid" },
        { vendor: "Office Supplies Co", amount: 12500, due: "2026-07-20", inv_date: "2026-06-15", status: "unpaid" },
        { vendor: "Marketing Agency", amount: 85000, due: "2026-08-01", inv_date: "2026-07-05", status: "paid" },
        { vendor: "AWS Cloud", amount: 32000, due: "2026-07-25", inv_date: "2026-06-28", status: "paid" },
        { vendor: "Consultant Fees", amount: 150000, due: "2026-08-10", inv_date: "2026-07-10", status: "unpaid" },
        { vendor: "Software Licenses", amount: 28000, due: "2026-08-05", inv_date: "2026-07-08", status: "unpaid" },
        { vendor: "Telecom Services", amount: 8500, due: "2026-07-15", inv_date: "2026-06-20", status: "overdue" },
        { vendor: "Legal Retainer", amount: 60000, due: "2026-08-20", inv_date: "2026-07-12", status: "paid" },
      ];

      const insert = db.query(
        `INSERT INTO invoices (id, user_id, vendor_name, amount, due_date, status, invoice_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );
      for (const inv of mockInvoices) {
        insert.run(generateId(), data.userId, inv.vendor, inv.amount, inv.due, inv.status, inv.inv_date);
      }

      // Also seed compliance tasks
      const existingCompliance = db.query("SELECT COUNT(*) as count FROM compliance_tasks WHERE user_id = ?").get(data.userId) as { count: number };
      if (existingCompliance.count === 0) {
        // Import and run seeding inline to avoid circular issues
        const { seedComplianceTasks } = await import("./compliance");
        await seedComplianceTasks({ data: { userId: data.userId } });
      }
    }

    // Get stats
    const totalRevenue = db
      .query("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE user_id = ? AND status = 'paid'")
      .get(data.userId) as { total: number };

    const unpaidTotal = db
      .query("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE user_id = ? AND status IN ('unpaid', 'overdue')")
      .get(data.userId) as { total: number };

    const unpaidCount = db
      .query("SELECT COUNT(*) as count FROM invoices WHERE user_id = ? AND status IN ('unpaid', 'overdue')")
      .get(data.userId) as { count: number };

    const invoices = db
      .query("SELECT * FROM invoices WHERE user_id = ? ORDER BY due_date ASC")
      .all(data.userId) as any[];

    return {
      totalRevenue: Number(totalRevenue.total),
      unpaidTotal: Number(unpaidTotal.total),
      unpaidCount: unpaidCount.count,
      invoices: invoices.map((r: any) => ({ ...r, amount: Number(r.amount) })),
      monthlyData: generateMockMonthlyData(),
    };
  });

function generateMockMonthlyData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((m) => ({
    month: m,
    revenue: Math.floor(Math.random() * 500000) + 200000,
    expenses: Math.floor(Math.random() * 300000) + 150000,
  }));
}