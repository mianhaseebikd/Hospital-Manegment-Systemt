import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeDollarSign,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  IdCard,
  Loader2,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Wallet,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import { fieldStateClass, getInitials, hasErrors, validateDoctorBasics } from "./doctorValidation.js";

const emptyEdit = {
  fullName: "",
  email: "",
  phone: "",
  cnic: "",
  specialization: "",
  bio: "",
  profileImageUrl: "",
  coverImageUrl: "",
  qualifications: "",
  experienceYears: "",
  dutyTimings: "",
  consultationFee: "",
  salaryType: "Fixed",
  baseSalary: "",
  commissionPercentage: ""
};

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setDoctor(await api.getDoctor(id));
    } catch (err) {
      toast.error(err.message || "Unable to load doctor profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async (form) => {
    const updated = await api.updateDoctor(id, {
      ...form,
      qualifications: form.qualifications
    });
    setDoctor(updated);
    setEditing(false);
    toast.success("Doctor profile updated successfully! 🎉");
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <Loader2 size={30} className="mx-auto animate-spin text-indigo-600" />
        <p className="mt-3 text-sm font-semibold text-slate-500">Loading doctor profile...</p>
      </section>
    );
  }

  if (!doctor) {
    return (
      <section className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
        Doctor profile not found.
      </section>
    );
  }

  const initials = getInitials(doctor.fullName);
  const salaryValue = doctor.salaryType === "Commission"
    ? `${doctor.commissionPercentage || 0}% Commission`
    : doctor.baseSalary
      ? `PKR ${doctor.baseSalary}`
      : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6">
        <Link to="/doctors" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-ink-strong">
          <ArrowLeft size={16} />
          Back to doctors
        </Link>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-bold text-navy-900 shadow-glow transition-all duration-200 hover:bg-brand-400"
        >
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      <div className="px-6">
        <section className="rounded-[34px] p-4 bg-gradient-to-br from-navy-900 to-brand-600 shadow-[0_28px_80px_rgba(27,42,107,0.26)] sm:p-6 lg:p-8">
          <div className="grid min-h-[320px] w-full overflow-hidden rounded-[28px] bg-navy-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <div
              className="relative h-32 bg-gradient-to-br from-navy-900 via-navy-800 to-brand-600 rounded-t-[28px] overflow-hidden"
              style={doctor.coverImageUrl ? {
                backgroundImage: `linear-gradient(105deg, rgba(15,23,42,0.72), rgba(49,46,129,0.42)), url(${doctor.coverImageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
              } : undefined}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.20),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(45,212,191,0.18),transparent_28)]" />
              <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                Doctor Profile
              </div>
            </div>

            <div className="px-6 pb-6 sm:px-8">
              <div className="-mt-16 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-6 border-white bg-gradient-to-br from-brand-50 to-navy-50 text-2xl font-black text-brand-700 shadow-2xl">
                    {doctor.profileImageUrl ? <img src={doctor.profileImageUrl} alt="" className="h-full w-full object-cover" /> : initials}
                  </div>
                  <div className="pb-2">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                        <ShieldCheck size={14} />
                        Active
                      </span>
                      <span className="inline-flex rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-700">
                        {doctor.specialization || "Specialization pending"}
                      </span>
                    </div>
                    <h1 className="text-3xl font-black tracking-normal text-ink-strong sm:text-4xl">{doctor.fullName}</h1>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-ink-muted">
                      <span className="inline-flex items-center gap-1.5"><Mail size={15} />{doctor.email}</span>
                      <span className="inline-flex items-center gap-1.5"><Phone size={15} />{doctor.phone}</span>
                      <span className="inline-flex items-center gap-1.5"><IdCard size={15} />{doctor.cnic}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <section className="grid gap-5 lg:grid-cols-[0.92fr_1.68fr]">
                <div className="space-y-5">
                  <ProfileCard title="Bio" icon={UserRound}>
                    <p className="min-h-28 text-sm leading-7 text-slate-600">
                      {doctor.bio || "Bio has not been added yet."}
                    </p>
                  </ProfileCard>
                  <ProfileCard title="Contact" icon={Phone}>
                    <div className="space-y-3 text-sm">
                      <ContactLine icon={Mail} label="Email" value={doctor.email} />
                      <ContactLine icon={Phone} label="Phone" value={doctor.phone} />
                      <ContactLine icon={IdCard} label="CNIC" value={doctor.cnic} />
                    </div>
                  </ProfileCard>
                </div>

                <div className="space-y-5">
                  <ProfileCard title="Qualifications" icon={GraduationCap}>
                    {doctor.qualifications?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {doctor.qualifications.map((item) => (
                          <span key={item} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No qualifications added yet.</p>
                    )}
                  </ProfileCard>

                  <div className="grid gap-4 md:grid-cols-2">
                    <MetricCard icon={BriefcaseBusiness} label="Experience" value={doctor.experienceYears ? `${doctor.experienceYears} years` : "Not added"} />
                    <MetricCard icon={Clock3} label="Duty Timings" value={doctor.dutyTimings || "Not added"} />
                    <MetricCard icon={BadgeDollarSign} label="OPD Fee" value={doctor.consultationFee ? `PKR ${doctor.consultationFee}` : "Not added"} />
                    <MetricCard icon={Wallet} label="Salary" value={salaryValue || "Not added"} />
                  </div>

                  <ProfileCard title="Clinical Setup" icon={Stethoscope}>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <MiniStat label="Salary Type" value={doctor.salaryType || "Fixed"} />
                      <MiniStat label="Base Salary" value={doctor.baseSalary ? `PKR ${doctor.baseSalary}` : "0"} />
                      <MiniStat label="Commission" value={`${doctor.commissionPercentage || 0}%`} />
                    </div>
                  </ProfileCard>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>

      {editing && <EditDoctorDrawer doctor={doctor} onClose={() => setEditing(false)} onSave={save} />}
    </div>
  );
}

function ProfileCard({ title, icon: Icon, children }) {
  return (
    <article className="rounded-[22px] border border-line bg-white/90 p-5 shadow-panel transition-shadow duration-200 hover:shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon size={18} />
        </div>
        <h2 className="text-base font-black text-ink-strong">{title}</h2>
      </div>
      {children}
    </article>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-[22px] border border-line bg-white p-5 shadow-panel transition-shadow duration-200 hover:shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-800 text-white">
          <Icon size={19} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-muted">{label}</p>
          <p className="mt-0.5 truncate text-lg font-black text-ink-strong">{value}</p>
        </div>
      </div>
    </article>
  );
}

function ContactLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-muted px-3 py-2.5">
      <Icon size={15} className="text-brand-700" />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</p>
        <p className="truncate font-semibold text-ink-base">{value || "Not added"}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-surface-muted px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-1 text-sm font-black text-ink-strong">{value}</p>
    </div>
  );
}

function EditDoctorDrawer({ doctor, onClose, onSave }) {
  const [form, setForm] = useState({
    ...emptyEdit,
    ...doctor,
    qualifications: (doctor.qualifications || []).join(", ")
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateDoctorBasics(form);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      toast.error("Failed to save! Please check the highlighted fields. ❌");
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      toast.error(err.message || "Failed to save! Please check the highlighted fields. ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 flex w-full max-w-3xl">
        <form noValidate onSubmit={submit} className="flex w-full flex-col bg-white shadow-2xl">
          <div className="border-b border-line bg-gradient-to-br from-navy-900 to-brand-600 px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-100">
                  <Sparkles size={14} />
                  Edit Mode
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-normal">Update Doctor Profile</h3>
                <p className="mt-1 text-sm text-white/80">Advanced details, salary, timings and profile media.</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20" aria-label="Close drawer">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <section className="grid gap-4 md:grid-cols-2">
              <DrawerField label="Doctor Name" error={errors.fullName}>
                <DrawerInput value={form.fullName} error={errors.fullName} onChange={(e) => set("fullName", e.target.value)} />
              </DrawerField>
              <DrawerField label="Email" error={errors.email}>
                <DrawerInput type="email" value={form.email} error={errors.email} onChange={(e) => set("email", e.target.value)} />
              </DrawerField>
              <DrawerField label="Phone" error={errors.phone}>
                <DrawerInput value={form.phone} error={errors.phone} onChange={(e) => set("phone", e.target.value)} />
              </DrawerField>
              <DrawerField label="CNIC" error={errors.cnic}>
                <DrawerInput value={form.cnic} error={errors.cnic} onChange={(e) => set("cnic", e.target.value)} />
              </DrawerField>
              <DrawerField label="Specialization">
                <DrawerInput value={form.specialization} onChange={(e) => set("specialization", e.target.value)} />
              </DrawerField>
              <DrawerField label="Experience Years">
                <DrawerInput type="number" min="0" value={form.experienceYears} onChange={(e) => set("experienceYears", e.target.value)} />
              </DrawerField>
              <DrawerField label="Duty Timings">
                <DrawerInput value={form.dutyTimings} onChange={(e) => set("dutyTimings", e.target.value)} placeholder="Morning 9 AM - 2 PM" />
              </DrawerField>
              <DrawerField label="OPD Fee">
                <DrawerInput type="number" min="0" value={form.consultationFee} onChange={(e) => set("consultationFee", e.target.value)} />
              </DrawerField>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <DrawerField label="Profile Image URL">
                <DrawerInput value={form.profileImageUrl} onChange={(e) => set("profileImageUrl", e.target.value)} />
              </DrawerField>
              <DrawerField label="Cover Image URL">
                <DrawerInput value={form.coverImageUrl} onChange={(e) => set("coverImageUrl", e.target.value)} />
              </DrawerField>
            </section>

            <DrawerField label="Bio">
              <textarea
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
              />
            </DrawerField>

            <DrawerField label="Education / Qualifications">
              <DrawerInput value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} placeholder="MBBS, FCPS, MD" />
            </DrawerField>

            <section className="grid gap-4 md:grid-cols-3">
              <DrawerField label="Salary Type">
                <select
                  value={form.salaryType}
                  onChange={(e) => set("salaryType", e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Commission">Commission</option>
                </select>
              </DrawerField>
              <DrawerField label="Base Salary">
                <DrawerInput type="number" min="0" value={form.baseSalary} onChange={(e) => set("baseSalary", e.target.value)} />
              </DrawerField>
              <DrawerField label="Commission %">
                <DrawerInput type="number" min="0" max="100" value={form.commissionPercentage} onChange={(e) => set("commissionPercentage", e.target.value)} />
              </DrawerField>
            </section>
          </div>

          <div className="flex justify-end gap-2 border-t border-line bg-surface-muted px-6 py-4">
            <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-line bg-white px-4 text-sm font-bold text-ink-base transition hover:bg-surface-muted">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-bold text-navy-900 shadow-glow transition hover:bg-brand-400 disabled:opacity-70">
              {saving && <Loader2 size={16} className="animate-spin" />}
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DrawerField({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </label>
  );
}

function DrawerInput({ error, className = "", ...props }) {
  return (
    <input
      className={[
        "min-h-11 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4",
        fieldStateClass(Boolean(error)),
        className
      ].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
