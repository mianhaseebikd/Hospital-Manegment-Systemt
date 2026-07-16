import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Loader2, Mail, Phone, Plus, Search, ShieldAlert, Stethoscope, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import { getInitials } from "./doctorValidation.js";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const specializations = useMemo(() => {
    const values = doctors.map((doctor) => doctor.specialization).filter(Boolean);
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  const load = async (params = { q: search, specialization }) => {
    setLoading(true);
    try {
      const data = await api.listDoctors(params);
      setDoctors(data || []);
    } catch (err) {
      toast.error(err.message || "Unable to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ q: "", specialization: "" });
  }, []);

  const submitFilters = (event) => {
    event.preventDefault();
    load({ q: search.trim(), specialization: specialization.trim() });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteDoctor(deleteTarget._id);
      toast.success("Doctor profile deleted successfully.");
      setDeleteTarget(null);
      load({ q: search.trim(), specialization: specialization.trim() });
    } catch (err) {
      toast.error(err.message || "Unable to delete doctor profile.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[24px] border border-line bg-white/90 p-5 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-700">Doctor Module</p>
          <h2 className="mt-1 text-2xl font-black text-ink-strong">Doctor Directory</h2>
          <p className="mt-1 text-sm text-ink-muted">Search, filter and manage hospital doctor profiles in a cleaner workflow.</p>
        </div>
        <Link
          to="/doctors/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 text-sm font-bold text-white transition-all duration-200 hover:bg-navy-700"
        >
          <Plus size={17} />
          Add Doctor
        </Link>
      </div>

      <section className="rounded-[24px] border border-line bg-white p-3 shadow-panel">
        <form noValidate onSubmit={submitFilters} className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_220px_auto]">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted/70" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone, CNIC"
              className="hms-input pl-9"
            />
          </div>
          <input
            value={specialization}
            onChange={(event) => setSpecialization(event.target.value)}
            list="doctor-specializations"
            placeholder="Specialization"
            className="hms-input"
          />
          <datalist id="doctor-specializations">
            {specializations.map((item) => <option key={item} value={item} />)}
          </datalist>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-bold text-navy-900 transition-all duration-200 hover:bg-brand-400"
          >
            <Filter size={16} />
            Filter
          </button>
        </form>
      </section>

      {loading ? (
        <section className="rounded-[24px] border border-line bg-white p-12 text-center shadow-panel">
          <Loader2 size={28} className="mx-auto animate-spin text-brand-600" />
          <p className="mt-3 text-sm font-semibold text-ink-muted">Loading doctors...</p>
        </section>
      ) : doctors.length ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} onDelete={() => setDeleteTarget(doctor)} />
          ))}
        </section>
      ) : (
        <section className="rounded-[24px] border border-dashed border-line bg-white p-12 text-center shadow-panel">
          <Stethoscope size={36} className="mx-auto text-ink-muted/70" />
          <p className="mt-3 text-base font-black text-ink-strong">No doctors found</p>
          <p className="mt-1 text-sm text-ink-muted">Try a different search or add the first doctor profile.</p>
        </section>
      )}

      {deleteTarget && (
        <DeleteDoctorModal
          doctor={deleteTarget}
          deleting={deleting}
          onClose={() => !deleting && setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function DoctorCard({ doctor, onDelete }) {
  const initials = getInitials(doctor.fullName);

  return (
    <article className="group overflow-hidden rounded-[24px] border border-line bg-white p-5 shadow-panel transition-all duration-200 hover:border-brand-200 hover:shadow-card">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-navy-50 text-base font-black text-brand-700 ring-4 ring-white">
          {doctor.profileImageUrl ? <img src={doctor.profileImageUrl} alt="" className="h-full w-full object-cover" /> : initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black text-ink-strong">{doctor.fullName}</h3>
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-ink-muted">
            <Mail size={14} className="shrink-0" />
            {doctor.email}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <Phone size={15} className="text-ink-muted/70" />
          {doctor.phone || "No phone added"}
        </p>
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          {doctor.specialization || "Specialization pending"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          to={`/doctors/${doctor._id}`}
          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-navy-800 px-3 text-sm font-bold text-white transition-all duration-200 hover:bg-navy-700"
        >
          View Profile
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-coral-100 bg-coral-50/40 px-3 text-sm font-bold text-coral-600 transition-all duration-200 hover:bg-coral-50"
        >
          Delete Profile
        </button>
      </div>
    </article>
  );
}

function DeleteDoctorModal({ doctor, deleting, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-white/20 bg-white shadow-[0_20px_60px_rgba(17,31,85,0.28)]">
        <div className="bg-gradient-to-br from-coral-50 to-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-100 text-coral-600">
              <ShieldAlert size={23} />
            </div>
            <div>
              <h3 className="text-xl font-black text-ink-strong">Delete doctor profile?</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                This will permanently remove <span className="font-bold text-ink-base">{doctor.fullName}</span>. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-line bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="min-h-10 rounded-xl border border-line px-4 text-sm font-bold text-ink-base transition hover:bg-surface-muted disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-coral-500 px-4 text-sm font-bold text-white transition hover:bg-coral-600 disabled:opacity-70"
          >
            {deleting && <Loader2 size={16} className="animate-spin" />}
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
