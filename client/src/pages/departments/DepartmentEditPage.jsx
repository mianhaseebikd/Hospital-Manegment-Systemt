import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DepartmentForm from "./DepartmentForm.jsx";
import { api } from "../../services/api.js";
import { useToast } from "../../contexts/ToastContext.jsx";

export default function DepartmentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [department, setDepartment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDepartment(id).then(setDepartment).catch((err) => setError(err.message));
  }, [id]);

  const submit = async ({ form, iconFile }) => {
    setError("");
    try {
      let updated = await api.updateDepartment(id, form);
      if (iconFile) updated = await api.uploadDepartmentIcon(id, iconFile);
      toast("Department updated");
      navigate(`/departments/${updated._id}`);
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    }
  };

  if (!department && !error) return <p className="text-sm text-ink-muted">Loading department...</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Departments</p>
          <h2 className="mt-1 text-2xl font-bold text-ink-strong">Edit Department</h2>
        </div>
        <Link to={`/departments/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink-strong">
          <ArrowLeft size={16} />
          Back to view
        </Link>
      </div>
      {error && <p className="rounded-lg bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-600">{error}</p>}
      {department && <DepartmentForm initialDepartment={department} onSubmit={submit} submitLabel="Save Changes" />}
    </div>
  );
}
