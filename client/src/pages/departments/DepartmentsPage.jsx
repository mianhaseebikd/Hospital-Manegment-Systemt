import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Eye, Plus, Power, Search, Trash2 } from "lucide-react";
import TextInput from "../../components/forms/TextInput.jsx";
import { api, getAssetUrl } from "../../services/api.js";
import { useToast } from "../../contexts/ToastContext.jsx";

export default function DepartmentsPage() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listDepartments({ q: search, status });
      setDepartments(data.departments || []);
      setStats(data.stats || { total: 0, active: 0, inactive: 0 });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const filteredLabel = useMemo(() => {
    if (status === "active") return "Active departments";
    if (status === "inactive") return "Inactive departments";
    return "All departments";
  }, [status]);

  const remove = async (department) => {
    if (!window.confirm(`Delete ${department.name}?`)) return;
    try {
      await api.deleteDepartment(department._id);
      toast("Department deleted");
      load();
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const toggle = async (department) => {
    try {
      await api.toggleDepartment(department._id);
      toast("Department status updated");
      load();
    } catch (err) {
      toast(err.message, "error");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Departments</p>
          <h2 className="mt-1 text-2xl font-bold text-ink-strong">View Departments</h2>
        </div>
        <Link
          to="/departments/new"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 text-sm font-bold text-white hover:bg-navy-700"
        >
          <Plus size={16} />
          Add Department
        </Link>
      </div>

      {error && <p className="rounded-lg bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-600">{error}</p>}

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Inactive" value={stats.inactive} />
      </section>

      <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              load();
            }}
            className="flex flex-1 gap-2"
          >
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <TextInput className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter by name, code, description" />
            </div>
            <button type="submit" className="min-h-10 rounded-lg bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-700">
              Search
            </button>
          </form>

          <select className="hms-input lg:w-48" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white shadow-panel">
        <div className="border-b border-line px-5 py-4">
        <p className="text-sm font-semibold text-ink-strong">{filteredLabel}</p>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-ink-muted">Loading departments...</p>
        ) : departments.length ? (
          <div className="divide-y divide-line">
            {departments.map((department) => (
              <DepartmentRow key={department._id} department={department} onToggle={toggle} onDelete={remove} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-ink-muted">No departments found</p>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink-strong">{value}</p>
    </div>
  );
}

function DepartmentRow({ department, onToggle, onDelete }) {
  const iconUrl = getAssetUrl(department.icon);
  const defaultId = localStorage.getItem("hms_default_department");
  const isDefault = department._id === defaultId;

  return (
    <div className="grid gap-4 px-5 py-4 transition hover:bg-brand-50/30 lg:grid-cols-[1fr_auto] lg:items-center">
      <Link to={`/departments/${department._id}`} className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-muted">
          {iconUrl ? <img src={iconUrl} alt="" className="h-full w-full object-cover" /> : <Building2 size={22} className="text-ink-muted" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-base font-bold text-ink-strong">{department.name}</p>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${department.isActive ? "bg-brand-50 text-brand-700" : "bg-surface-muted text-ink-muted"}`}>
              {department.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{department.description || ""}</p>
        </div>
      </Link>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {isDefault && (
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">Default</span>
        )}
        <Link to={`/departments/${department._id}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-base hover:bg-surface-muted">
          <Eye size={15} />
          View
        </Link>
        <button type="button" onClick={() => {
          localStorage.setItem("hms_default_department", department._id);
          toast("Default department set");
          window.dispatchEvent(new Event('hms:default-department-changed'));
        }} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-base hover:bg-surface-muted" title="Set as default">
          Default
        </button>
        <button type="button" onClick={() => onToggle(department)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-base hover:bg-surface-muted" title="Active/Inactive">
          <Power size={15} />
          {department.isActive ? "Inactive" : "Active"}
        </button>
        <button type="button" onClick={() => onDelete(department)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-coral-100 px-3 text-sm font-semibold text-coral-600 hover:bg-coral-50">
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </div>
  );
}
