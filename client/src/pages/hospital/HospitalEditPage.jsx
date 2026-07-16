import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Save, Upload } from "lucide-react";
import Field from "../../components/forms/Field.jsx";
import TextInput from "../../components/forms/TextInput.jsx";
import DatePicker from "../../components/forms/DatePicker.jsx";
import { api, getAssetUrl } from "../../services/api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";

const emptyForm = {
  name: "",
  tagline: "",
  legalName: "",
  registrationNumber: "",
  bio: "",
  website: "",
  contactEmail: "",
  contactPhone: "",
  emergencyPhone: "",
  address: "",
  city: "",
  country: "",
  establishedYear: "",
  establishedDate: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
  ceoName: "",
  ceoEmail: "",
  ceoPhone: "",
  isActive: "",
  logo: ""
};

export default function HospitalEditPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { updateLocalHospital } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getHospitalProfile()
      .then((data) => {
        const hospital = data.hospital || {};
        setForm({
          ...emptyForm,
          ...hospital,
          establishedYear: hospital.establishedYear || "",
          establishedDate: hospital.establishedDate || ""
        });
        updateLocalHospital(hospital);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [updateLocalHospital]);

  const set = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        establishedYear: form.establishedDate
          ? Number(form.establishedDate.slice(0, 4))
          : form.establishedYear
            ? Number(form.establishedYear)
            : null
      };
      let response = await api.updateHospitalProfile(payload);
      if (logoFile) {
        response = await api.uploadHospitalLogo(logoFile);
      }
      updateLocalHospital(response.hospital);
      toast("Hospital profile saved");
      navigate("/hospital");
    } catch (err) {
      setError(err.message || "Profile save failed");
      toast(err.message || "Profile save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-muted">Loading profile form...</p>;

  const logoPreview = logoFile ? URL.createObjectURL(logoFile) : getAssetUrl(form.logo);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Hospital Module</p>
          <h2 className="mt-1 text-2xl font-bold text-ink-strong">Edit Hospital Profile</h2>
        </div>
        <Link to="/hospital" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink-strong">
          <ArrowLeft size={16} />
          Back to profile
        </Link>
      </div>

      {error && <p className="rounded-lg bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-600">{error}</p>}

      <form onSubmit={submit} className="space-y-5">
        <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <h3 className="mb-5 text-base font-bold text-ink-strong">Branding</h3>
          <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
            <div className="space-y-3">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-muted">
                {logoPreview ? (
                  <img src={logoPreview} alt="Hospital logo preview" className="h-full w-full object-cover" />
                ) : (
                  <Building2 size={42} className="text-ink-muted" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-base hover:bg-surface-muted"
              >
                <Upload size={16} />
                Logo
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Hospital Name">
                <TextInput value={form.name} onChange={(event) => set("name", event.target.value)} required />
              </Field>
              <Field label="Legal Name">
                <TextInput value={form.legalName} onChange={(event) => set("legalName", event.target.value)} />
              </Field>
              <Field label="Tagline">
                <TextInput value={form.tagline} onChange={(event) => set("tagline", event.target.value)} />
              </Field>
              <Field label="Registration Number">
                <TextInput value={form.registrationNumber} onChange={(event) => set("registrationNumber", event.target.value)} />
              </Field>
              <Field label="Established Date">
                <DatePicker value={form.establishedDate} onChange={(value) => set("establishedDate", value)} />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <h3 className="mb-5 text-base font-bold text-ink-strong">About and Contact</h3>
          <div className="space-y-4">
            <Field label="About Hospital">
              <textarea
                className="hms-input min-h-[120px] w-full resize-y py-3"
                value={form.bio}
                onChange={(event) => set("bio", event.target.value)}
                placeholder="Hospital intro, services and mission"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Contact Email">
                <TextInput type="email" value={form.contactEmail} onChange={(event) => set("contactEmail", event.target.value)} />
              </Field>
              <Field label="Contact Phone">
                <TextInput value={form.contactPhone} onChange={(event) => set("contactPhone", event.target.value)} />
              </Field>
              <Field label="Emergency Phone">
                <TextInput value={form.emergencyPhone} onChange={(event) => set("emergencyPhone", event.target.value)} />
              </Field>
              <Field label="Website">
                <TextInput value={form.website} onChange={(event) => set("website", event.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Address">
                <TextInput value={form.address} onChange={(event) => set("address", event.target.value)} />
              </Field>
              <Field label="City">
                <TextInput value={form.city} onChange={(event) => set("city", event.target.value)} />
              </Field>
              <Field label="Country">
                <TextInput value={form.country} onChange={(event) => set("country", event.target.value)} />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <h3 className="mb-5 text-base font-bold text-ink-strong">Admin and CEO</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Hospital Admin">
              <TextInput value={form.adminName} onChange={(event) => set("adminName", event.target.value)} />
            </Field>
            <Field label="Admin Email">
              <TextInput type="email" value={form.adminEmail} onChange={(event) => set("adminEmail", event.target.value)} />
            </Field>
            <Field label="Admin Phone">
              <TextInput value={form.adminPhone} onChange={(event) => set("adminPhone", event.target.value)} />
            </Field>
            <Field label="CEO Name">
              <TextInput value={form.ceoName} onChange={(event) => set("ceoName", event.target.value)} />
            </Field>
            <Field label="CEO Email">
              <TextInput type="email" value={form.ceoEmail} onChange={(event) => set("ceoEmail", event.target.value)} />
            </Field>
            <Field label="CEO Phone">
              <TextInput value={form.ceoPhone} onChange={(event) => set("ceoPhone", event.target.value)} />
            </Field>
          </div>
        </section>

        <div className="sticky bottom-0 flex gap-3 border-t border-line bg-surface-page/95 py-4 backdrop-blur">
          <Link
            to="/hospital"
            className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-line bg-white text-sm font-bold text-ink-base hover:bg-surface-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-navy-800 text-sm font-bold text-white hover:bg-navy-700 disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
