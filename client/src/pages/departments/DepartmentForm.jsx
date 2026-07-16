import { useRef, useState } from "react";
import { Building2, Save, Upload } from "lucide-react";
import Field from "../../components/forms/Field.jsx";
import TextInput from "../../components/forms/TextInput.jsx";
import { getAssetUrl } from "../../services/api.js";

const emptyForm = {
  name: "",
  code: "",
  description: "",
  isActive: true
};

export default function DepartmentForm({ initialDepartment, onSubmit, submitLabel }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    ...emptyForm,
    ...initialDepartment,
    code: initialDepartment?.code || ""
  });
  const [iconFile, setIconFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ form, iconFile });
    } finally {
      setSaving(false);
    }
  };

  const iconPreview = iconFile ? URL.createObjectURL(iconFile) : getAssetUrl(form.icon);

  return (
    <form onSubmit={submit} className="space-y-5">
      <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
        <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
          <div className="space-y-3">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-muted">
              {iconPreview ? (
                <img src={iconPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 size={38} className="text-ink-muted" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-base hover:bg-surface-muted"
            >
              <Upload size={16} />
              Upload Icon
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => setIconFile(event.target.files?.[0] || null)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department Name" required>
              <TextInput value={form.name} onChange={(event) => set("name", event.target.value)} required />
            </Field>
            <Field label="Code">
              <TextInput value={form.code} onChange={(event) => set("code", event.target.value)} placeholder="Auto generated if empty" />
            </Field>
            <Field label="Status">
              <select className="hms-input" value={form.isActive ? "active" : "inactive"} onChange={(event) => set("isActive", event.target.value === "active")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  className="hms-input min-h-[110px] w-full resize-y py-3"
                  value={form.description}
                  onChange={(event) => set("description", event.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 flex gap-3 border-t border-line bg-surface-page/95 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={saving}
          className="ml-auto inline-flex min-h-10 min-w-40 items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 text-sm font-bold text-white hover:bg-navy-700 disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
