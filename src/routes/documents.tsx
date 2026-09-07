import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  DashboardLayout,
  LoadingSpinner,
  PageHeader,
} from "~/components/DashboardLayout";
import { uploadDocument, getDocuments, seedDocuments } from "~/lib/documents";
import { useAuth } from "~/lib/use-auth";

export const Route = createFileRoute("/documents")({
  component: DocumentsPage,
});

const DOC_TYPES = [
  { value: "invoice", label: "Invoice" },
  { value: "contract", label: "Contract" },
  { value: "gst", label: "GST Return" },
  { value: "pan", label: "PAN Card" },
  { value: "purchase_order", label: "Purchase Order" },
  { value: "salary_slip", label: "Salary Slip" },
] as const;

interface Doc {
  id: string;
  filename: string;
  file_type: string;
  upload_date: string;
  status: string;
  extracted_data: Record<string, string>;
}

function DocumentsPage() {
  const { user, loading: authLoading, handleLogout } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const [fileType, setFileType] = useState("invoice");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    loadDocs();
  }, [user]);

  async function loadDocs() {
    setLoading(true);
    try {
      const result = await getDocuments({ data: { userId: user!.id } });
      setDocs(result);
    } catch (err: any) {
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedDocs() {
    try {
      const result = await seedDocuments({ data: { userId: user!.id } });
      if (result.seeded) {
        setUploadMsg(`${result.seeded} sample documents added!`);
        await loadDocs();
      }
    } catch (err: any) {
      setError(err.message || "Failed to add sample documents");
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) return;

    const file = fileInput.files[0];
    setUploading(true);
    setUploadMsg("");
    setError("");

    try {
      const result = await uploadDocument({
        data: {
          userId: user!.id,
          filename: file.name,
          fileType,
        },
      });
      setUploadMsg(
        `"${file.name}" uploaded and processed successfully!`,
      );
      fileInput.value = "";
      await loadDocs();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (authLoading) return <LoadingSpinner />;

  return (
    <DashboardLayout user={user!} onLogout={handleLogout}>
      <PageHeader
        title="Document AI"
        description="Upload documents for AI-powered data extraction"
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200/50">
          {error}
        </div>
      )}
      {uploadMsg && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200/50">
          {uploadMsg}
        </div>
      )}

      {/* Seed sample docs button */}
      {docs.length === 0 && (
        <div className="mb-6 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              📂
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-brand-900">
                No documents yet
              </h4>
              <p className="text-xs text-brand-700">
                Want to see how document AI extraction works? Add some sample docs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSeedDocs}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Add Sample Docs
            </button>
          </div>
        </div>
      )}

      {/* Upload area */}
      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Upload a document
        </h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Select file
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Document type
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {DOC_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Supported: PDF, JPG, PNG, CSV, XLSX. AI auto-extracts data.
        </p>
      </form>

      {/* Documents table */}
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Uploaded Documents
      </h3>

      {loading ? (
        <LoadingSpinner />
      ) : docs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <span className="text-4xl">📂</span>
          <p className="mt-3 text-sm font-medium text-gray-900">No documents yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Upload your first document above to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(expandedId === doc.id ? null : doc.id)
                }
                className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-gray-50"
              >
                <span className="text-2xl">
                  {doc.file_type === "invoice"
                    ? "🧾"
                    : doc.file_type === "contract"
                      ? "📝"
                      : doc.file_type === "gst"
                        ? "🏛️"
                        : doc.file_type === "pan"
                          ? "🪪"
                          : doc.file_type === "purchase_order"
                            ? "📦"
                            : "💵"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {doc.filename}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {doc.file_type.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(doc.upload_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    doc.status === "processed"
                      ? "bg-green-50 text-green-700 ring-green-200/50"
                      : "bg-yellow-50 text-yellow-700 ring-yellow-200/50"
                  }`}
                >
                  {doc.status}
                </span>
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    expandedId === doc.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Expanded extracted data */}
              {expandedId === doc.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Extracted Data
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(doc.extracted_data).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="rounded-lg bg-white px-3 py-2 ring-1 ring-gray-100"
                        >
                          <p className="text-xs text-gray-400 capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {value}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
