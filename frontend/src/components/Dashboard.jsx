import { useEffect, useMemo, useState } from "react";
import { createItem, deleteItem, getItems, getStats, updateItem } from "../api/itemApi";
import { useAuth } from "../context/AuthContext";

const defaultForm = { title: "", description: "", status: "active" };
const statusOptions = ["active", "pending", "completed"];

function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, completed: 0 });
  const [form, setForm] = useState(defaultForm);
  const [editItemId, setEditItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = useMemo(() => editItemId !== null, [editItemId]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsData, statsData] = await Promise.all([getItems(), getStats()]);
      setItems(itemsData.items || []);
      setStats(statsData.stats || { total: 0, active: 0, pending: 0, completed: 0 });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm(defaultForm);
    setEditItemId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateItem(editItemId, form);
        setSuccess("Item updated successfully.");
      } else {
        await createItem(form);
        setSuccess("Item added successfully.");
      }
      resetForm();
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditItemId(item.id);
    setForm({ title: item.title, description: item.description || "", status: item.status });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this item?");
    if (!ok) return;

    setError("");
    setSuccess("");
    try {
      await deleteItem(id);
      setSuccess("Item deleted successfully.");
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not delete item.");
    }
  };

  const handleQuickStatusUpdate = async (id, status) => {
    setError("");
    setSuccess("");
    try {
      await updateItem(id, { status });
      setSuccess("Status updated.");
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not update status.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome, {user?.name || "User"}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && <div className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">{success}</div>}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Items" value={stats.total} />
          <StatCard title="Active Items" value={stats.active} />
          <StatCard title="Pending Items" value={stats.pending} />
          <StatCard title="Completed Items" value={stats.completed} />
        </section>

        <section className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-slate-800">{isEditing ? "Edit Item" : "Add New Item"}</h2>
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Item title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                disabled={submitting}
                type="submit"
                className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
              >
                {submitting ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md bg-slate-300 text-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-400 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Your Items</h2>
          </div>
          {loading ? (
            <p className="p-6 text-slate-600">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="p-6 text-slate-600">No items yet. Add your first item above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-4 py-3">Title</th>
                    <th className="text-left px-4 py-3">Description</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-800">{item.title}</td>
                      <td className="px-4 py-3 text-slate-600">{item.description || "-"}</td>
                      <td className="px-4 py-3">
                        <select
                          className="rounded-md border border-slate-300 px-2 py-1"
                          value={item.status}
                          onChange={(e) => handleQuickStatusUpdate(item.id, e.target.value)}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded-md bg-blue-600 text-white px-3 py-1.5 hover:bg-blue-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-md bg-red-600 text-white px-3 py-1.5 hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

export default Dashboard;
