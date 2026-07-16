import { useEffect, useState } from "react";
import { Save, Settings, UserRound } from "lucide-react";
import Field from "../components/forms/Field.jsx";
import TextInput from "../components/forms/TextInput.jsx";
import TimeSelect, { formatTimeLabel } from "../components/forms/TimeSelect.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { api } from "../services/api.js";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  username: "",
  opdStartTime: "",
  opdEndTime: ""
};

export default function SettingsPage() {
  const { user, updateLocalHospital, updateLocalUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getHospitalProfile()
      .then((data) => {
        const hospital = data.hospital || {};
        setForm({
          fullName: user?.fullName || "",
          email: user?.email || "",
          phone: user?.phone || "",
          username: user?.username || "",
          opdStartTime: hospital.opdStartTime || "",
          opdEndTime: hospital.opdEndTime || ""
        });
        updateLocalHospital(hospital);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [updateLocalHospital, user]);

  const set = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updatedUser = await api.updateAdminProfile({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        username: form.username
      });
      updateLocalUser(updatedUser);

      const hospitalPayload = {
        adminName: form.fullName,
        adminEmail: form.email,
        adminPhone: form.phone,
        opdStartTime: form.opdStartTime,
        opdEndTime: form.opdEndTime,
        workingHours: form.opdStartTime && form.opdEndTime
          ? `24/7 Emergency | OPD ${formatTimeLabel(form.opdStartTime)} - ${formatTimeLabel(form.opdEndTime)}`
          : ""
      };
      const response = await api.updateHospitalProfile(hospitalPayload);
      updateLocalHospital(response.hospital);
      toast("Admin settings saved");
    } catch (err) {
      setError(err.message || "Settings save failed");
      toast(err.message || "Settings save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-muted">Loading settings...</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Hospital Module</p>
        <h2 className="mt-1 text-2xl font-bold text-ink-strong">Admin Settings</h2>
      </div>

      {error && <p className="rounded-lg bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-600">{error}</p>}

      <form onSubmit={submit} className="space-y-5">
        <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <div className="mb-5 flex items-center gap-2">
            <UserRound size={18} className="text-brand-700" />
            <h3 className="text-base font-semibold text-ink-strong">Admin Profile</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Full Name">
              <TextInput value={form.fullName} onChange={(event) => set("fullName", event.target.value)} required />
            </Field>
            <Field label="Email">
              <TextInput type="email" value={form.email} onChange={(event) => set("email", event.target.value)} required />
            </Field>
            <Field label="Phone">
              <TextInput value={form.phone} onChange={(event) => set("phone", event.target.value)} />
            </Field>
            <Field label="Username">
              <TextInput value={form.username} onChange={(event) => set("username", event.target.value)} />
            </Field>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <div className="mb-5 flex items-center gap-2">
            <Settings size={18} className="text-brand-700" />
            <h3 className="text-base font-semibold text-ink-strong">Hospital Timings</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="OPD Start Time">
              <TimeSelect value={form.opdStartTime} onChange={(value) => set("opdStartTime", value)} />
            </Field>
            <Field label="OPD End Time">
              <TimeSelect value={form.opdEndTime} onChange={(value) => set("opdEndTime", value)} />
            </Field>
            <Field label="Working Hours">
              <TextInput value={form.opdStartTime && form.opdEndTime ? `24/7 Emergency | OPD ${formatTimeLabel(form.opdStartTime)} - ${formatTimeLabel(form.opdEndTime)}` : ""} readOnly />
            </Field>
          </div>
        </section>

        <div className="sticky bottom-0 flex justify-end border-t border-line bg-surface-page/95 py-4 backdrop-blur">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-11 min-w-44 items-center justify-center gap-2 rounded-lg bg-navy-800 px-5 text-sm font-bold text-white hover:bg-navy-700 disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
