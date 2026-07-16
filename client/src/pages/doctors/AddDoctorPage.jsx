import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, IdCard, Loader2, Mail, Phone, Sparkles, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import { fieldStateClass, hasErrors, validateDoctorBasics } from "./doctorValidation.js";

const emptyForm = { fullName: "", email: "", phone: "", cnic: "" };
const visualImage =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=980&q=85";

export default function AddDoctorPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [activeField, setActiveField] = useState("");
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const set = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await api.listDepartments({ q: "", status: "all" });
        const list = Array.isArray(data) ? data : data.departments || [];
        setDepartments(list || []);
        const saved = localStorage.getItem("hms_default_department");
        if (saved && list.find((d) => d._id === saved)) {
          setSelectedDept(saved);
        } else if (list.length) {
          setSelectedDept(list[0]._id);
        }
      } catch (err) {
        // ignore
      }
    };
    loadDepartments();
    const onDefaultChange = () => {
      const saved = localStorage.getItem("hms_default_department");
      if (saved) setSelectedDept(saved);
    };
    window.addEventListener('hms:default-department-changed', onDefaultChange);
    return () => window.removeEventListener('hms:default-department-changed', onDefaultChange);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateDoctorBasics(form);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      toast.error("Failed to save! Please check the highlighted fields.");
      return;
    }

    setSaving(true);
    try {
      const doctor = await api.createDoctor({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        cnic: form.cnic.trim(),
        departmentId: selectedDept || undefined
      });
      toast.success("Doctor added successfully!");
      navigate(`/doctors/${doctor._id}`);
    } catch (err) {
      toast.error(err.message || "Failed to save! Please check the highlighted fields.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-full px-6">
      <Link
        to="/doctors"
        className="mb-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-ink-strong"
      >
        <ArrowLeft size={16} />
        Back to doctors
      </Link>

      <section className="rounded-[34px] p-4 bg-gradient-to-br from-navy-900 to-brand-600 shadow-[0_28px_80px_rgba(27,42,107,0.26)] sm:p-6 lg:p-8">
        <div className="grid min-h-[640px] w-full overflow-hidden rounded-[28px] bg-navy-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] lg:grid-cols-[0.98fr_1.02fr]">
          <aside className="relative min-h-[360px] overflow-hidden p-4 sm:p-6 lg:min-h-full">
            <div
              className="relative h-full min-h-[520px] overflow-hidden rounded-[26px] bg-cover bg-center shadow-[0_22px_60px_rgba(17,31,85,0.18)] lg:rounded-r-[42px]"
              style={{ backgroundImage: `url(${visualImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/45 via-navy-800/8 to-white/10" />
              <div className="absolute right-[-1px] top-[-1px] hidden h-24 w-24 rounded-bl-[42px] bg-navy-50 lg:block" />

              <div className="relative z-10 flex h-full flex-col justify-between p-7 sm:p-8">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/75 px-4 py-2 text-sm font-black tracking-[0.22em] text-navy-800 shadow-card backdrop-blur-md">
                  <Sparkles size={16} className="text-brand-600" />
                  HMS
                </div>

                <div className="max-w-sm rounded-[28px] border border-white/25 bg-navy-900/35 p-6 text-white shadow-[0_18px_55px_rgba(15,24,41,0.28)] backdrop-blur-md">
                  <p className="text-2xl font-black leading-tight tracking-normal">
                    Add doctors with clean profile-ready records.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/78">
                    Basic information only now. Profile, timings, fee and salary can be completed from the profile screen.
                  </p>
                  <div className="mt-5 inline-flex rounded-full border border-white/35 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/10">
                    Doctor Module
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
            <div className="w-full max-w-[560px]">
              <StepHeader />

              <div className="mb-8 text-center lg:text-left">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-700">Add Doctor</p>
                <h1 className="mt-3 text-4xl font-black tracking-normal text-ink-strong">Create Doctor</h1>
                <p className="mt-3 text-sm leading-6 text-ink-muted">
                  Enter the required identity details. Custom validation will highlight anything missing or invalid.
                </p>
              </div>

              <form noValidate onSubmit={submit} className="space-y-4">
                <IconField
                  label="Doctor Name"
                  field="fullName"
                  icon={UserRound}
                  value={form.fullName}
                  error={errors.fullName}
                  active={activeField === "fullName"}
                  onFocus={() => setActiveField("fullName")}
                  onBlur={() => setActiveField("")}
                  onChange={(event) => set("fullName", event.target.value)}
                  placeholder="Dr. Ayesha Khan"
                />
                <IconField
                  label="Email"
                  field="email"
                  type="email"
                  icon={Mail}
                  value={form.email}
                  error={errors.email}
                  active={activeField === "email"}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField("")}
                  onChange={(event) => set("email", event.target.value)}
                  placeholder="doctor@hospital.com"
                />
                <IconField
                  label="Phone"
                  field="phone"
                  icon={Phone}
                  value={form.phone}
                  error={errors.phone}
                  active={activeField === "phone"}
                  onFocus={() => setActiveField("phone")}
                  onBlur={() => setActiveField("")}
                  onChange={(event) => set("phone", event.target.value)}
                  placeholder="+92 300 1234567"
                />
                <IconField
                  label="CNIC"
                  field="cnic"
                  icon={IdCard}
                  value={form.cnic}
                  error={errors.cnic}
                  active={activeField === "cnic"}
                  onFocus={() => setActiveField("cnic")}
                  onBlur={() => setActiveField("")}
                  onChange={(event) => set("cnic", event.target.value)}
                  placeholder="35202-1234567-1"
                />

                  <div className="mt-2">
                    <label className="block mb-2 text-xs font-bold text-ink-base">Department</label>
                    <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="hms-input">
                      {departments.length ? departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      )) : <option value="">No departments</option>}
                    </select>
                  </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-black uppercase tracking-[0.08em] text-navy-900 shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_16px_32px_rgba(78,205,196,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {saving ? "Creating..." : "Create Doctor"}
                </button>
              </form>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

function StepHeader() {
  const steps = [
    { number: 1, label: "Basic Details", active: true },
    { number: 2, label: "Profile Later" },
    { number: 3, label: "Dashboard" }
  ];

  return (
    <div className="mb-10 hidden items-center justify-end gap-3 md:flex">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={[
                "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-black",
                step.active ? "border-navy-700 bg-navy-700 text-white" : "border-line bg-white text-ink-muted"
              ].join(" ")}
            >
              {step.number}
            </span>
            <span className={["text-xs font-bold", step.active ? "text-navy-700" : "text-ink-muted/60"].join(" ")}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && <span className="h-px w-10 bg-line" />}
        </div>
      ))}
    </div>
  );
}

function IconField({ label, field, icon: Icon, error, active, className = "", ...props }) {
  return (
    <label className={["block", className].filter(Boolean).join(" ")}>
      <span className="mb-2 block text-xs font-bold text-ink-base">{label}</span>
      <div className="relative">
        <Icon
          size={17}
          className={[
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200",
            error ? "text-red-500" : active ? "text-brand-600" : "text-ink-muted/55"
          ].join(" ")}
        />
        <input
          id={field}
          name={field}
          className={[
            "min-h-12 w-full rounded-sm border px-11 text-sm text-ink-strong outline-none transition-all duration-200 placeholder:text-ink-muted/45 focus:ring-4",
            fieldStateClass(Boolean(error))
          ].join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${field}-error` : undefined}
          {...props}
        />
      </div>
      {error && <p id={`${field}-error`} className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </label>
  );
}
