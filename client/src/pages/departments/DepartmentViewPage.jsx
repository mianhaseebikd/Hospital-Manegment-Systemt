import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Edit2, Power, Trash2 } from "lucide-react";
import { api, getAssetUrl } from "../../services/api.js";
import { useToast } from "../../contexts/ToastContext.jsx";

export default function DepartmentViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [department, setDepartment] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.getDepartment(id).then(setDepartment).catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, [id]);

  const toggle = async () => {
    try {
      const updated = await api.toggleDepartment(id);
      setDepartment(updated);
      toast("Department status updated");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${department.name}?`)) return;
    try {
      await api.deleteDepartment(id);
      toast("Department deleted");
      navigate("/departments");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  if (!department && !error) return <p className="text-sm text-ink-muted">Loading department...</p>;
  if (error && !department) return <p className="rounded-lg bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-600">{error}</p>;

  const iconUrl = getAssetUrl(department.icon);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Department</p>
          <h2 className="mt-1 text-2xl font-bold text-ink-strong">{department.name}</h2>
        </div>
        <Link to="/departments" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink-strong">
          <ArrowLeft size={16} />
          Back to list
        </Link>
      </div>

      <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-muted">
              {iconUrl ? <img src={iconUrl} alt="" className="h-full w-full object-cover" /> : <Building2 size={38} className="text-ink-muted" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-ink-strong">{department.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${department.isActive ? "bg-brand-50 text-brand-700" : "bg-surface-muted text-ink-muted"}`}>
                  {department.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {department.code && <p className="mt-1 text-sm font-medium text-ink-muted">{department.code}</p>}
              {department.description && <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{department.description}</p>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to={`/departments/${id}/edit`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-base hover:bg-surface-muted">
              <Edit2 size={15} />
              Edit
            </Link>
            <button type="button" onClick={toggle} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-base hover:bg-surface-muted">
              <Power size={15} />
              {department.isActive ? "Inactive" : "Active"}
            </button>
            <button type="button" onClick={remove} className="inline-flex h-9 items-center gap-2 rounded-lg border border-coral-100 px-3 text-sm font-semibold text-coral-600 hover:bg-coral-50">
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
