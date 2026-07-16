import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import DepartmentForm from "./DepartmentForm.jsx";
import { api } from "../../services/api.js";
import { useToast } from "../../contexts/ToastContext.jsx";

export default function DepartmentNewPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState("");

  const submit = async ({ form, iconFile }) => {
    setError("");
    try {
      let department = await api.createDepartment(form);
      if (iconFile) department = await api.uploadDepartmentIcon(department._id, iconFile);
      toast("Department created");
      navigate("/departments");
    } catch (err) {
      setError(err.message);
      toast(err.message, "error");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Departments</p>
          <h2 className="mt-1 text-2xl font-bold text-ink-strong">Add Department</h2>
        </div>
        <Link to="/departments" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink-strong">
          <ArrowLeft size={16} />
          Back to list
        </Link>
      </div>
      {error && <p className="rounded-lg bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-600">{error}</p>}
      <DepartmentForm onSubmit={submit} submitLabel="Save Department" />
    </div>
  );
}
