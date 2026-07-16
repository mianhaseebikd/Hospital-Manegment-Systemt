import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Clock3,
  Globe2,
  Mail,
  MapPin,
  PenLine,
  Phone,
  UserRound
} from "lucide-react";
import { api, getAssetUrl } from "../../services/api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function HospitalViewPage() {
  const { updateLocalHospital } = useAuth();
  const [hospital, setHospital] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getHospitalProfile()
      .then((data) => {
        setHospital(data.hospital);
        updateLocalHospital(data.hospital);
      })
      .catch((err) => setError(err.message));
  }, [updateLocalHospital]);

  if (error) return <p className="rounded-lg bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-600">{error}</p>;
  if (!hospital) return <p className="text-sm text-ink-muted">Loading hospital profile...</p>;

  const logoUrl = getAssetUrl(hospital.logo);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-muted">
                {logoUrl ? (
                  <img src={logoUrl} alt="Hospital logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 size={38} className="text-ink-muted" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Hospital Profile</p>
                <h2 className="mt-1 text-3xl font-bold tracking-normal text-ink-strong">{hospital.name}</h2>
                {hospital.tagline && <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{hospital.tagline}</p>}
              </div>
            </div>

            <Link
              to="/hospital/edit"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 text-sm font-bold text-white hover:bg-navy-700"
            >
              <PenLine size={16} />
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ProfilePanel title="Contact Details">
          <Detail icon={Mail} label="Email" value={hospital.contactEmail} />
          <Detail icon={Phone} label="Phone" value={hospital.contactPhone} />
          <Detail icon={Phone} label="Emergency" value={hospital.emergencyPhone} />
          <Detail icon={Globe2} label="Website" value={hospital.website} />
        </ProfilePanel>

        <ProfilePanel title="Leadership">
          <Detail icon={UserRound} label="Hospital Admin" value={hospital.adminName} />
          <Detail icon={Mail} label="Admin Email" value={hospital.adminEmail} />
          <Detail icon={UserRound} label="CEO" value={hospital.ceoName} />
          <Detail icon={Phone} label="CEO Phone" value={hospital.ceoPhone} />
        </ProfilePanel>

        <ProfilePanel title="Hospital Timings">
          <Detail icon={Clock3} label="Working Hours" value={hospital.workingHours} />
        </ProfilePanel>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <h3 className="text-base font-bold text-ink-strong">About Hospital</h3>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            {hospital.bio || ""}
          </p>
        </div>

        <div className="rounded-lg border border-line bg-white p-6 shadow-panel">
          <h3 className="text-base font-bold text-ink-strong">Location</h3>
          <div className="mt-3 space-y-3 text-sm text-ink-muted">
            <Detail icon={MapPin} label="Address" value={hospital.address} />
            <Detail icon={Building2} label="City" value={hospital.city} />
            <Detail icon={Globe2} label="Country" value={hospital.country} />
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfilePanel({ title, children }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-panel">
      <h3 className="mb-4 text-base font-bold text-ink-strong">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</p>
        <p className="mt-0.5 min-h-5 break-words text-sm font-semibold text-ink-strong">{value || ""}</p>
      </div>
    </div>
  );
}
