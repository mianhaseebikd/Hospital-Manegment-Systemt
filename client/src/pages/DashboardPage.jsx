import { Building2, CheckCircle2, Mail, MapPin, PenLine, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getAssetUrl } from "../services/api.js";

const profileFields = [
  "name",
  "contactEmail",
  "contactPhone",
  "address",
  "adminName",
  "ceoName",
  "workingHours",
  "logo"
];

export default function DashboardPage() {
  const { user, hospital } = useAuth();
  const completed = profileFields.filter((field) => Boolean(hospital?.[field])).length;
  const completion = Math.round((completed / profileFields.length) * 100);
  const logoUrl = getAssetUrl(hospital?.logo);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
              <CheckCircle2 size={15} />
              Dummy admin active
            </div>
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-bold tracking-normal text-ink-strong">Hospital setup dashboard</h2>
              <p className="text-base leading-7 text-ink-muted">
                Start from the hospital profile. Add logo, CEO, admin contact, public contact details and basic site settings.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/hospital/edit"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-navy-800 px-4 text-sm font-bold text-white hover:bg-navy-700"
              >
                <PenLine size={16} />
                Edit Hospital Profile
              </Link>
              <Link
                to="/hospital"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-bold text-ink-base hover:bg-surface-muted"
              >
                <Building2 size={16} />
                View Profile
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-surface-muted p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-line bg-white">
                {logoUrl ? (
                  <img src={logoUrl} alt="Hospital logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 size={32} className="text-ink-muted" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-ink-strong">{hospital?.name || ""}</p>
                <p className="truncate text-sm text-ink-muted">{hospital?.tagline || ""}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-base">Profile completion</span>
                <span className="font-bold text-brand-700">{completion}%</span>
              </div>
              <div className="h-2 rounded-full bg-line">
                <div className="h-2 rounded-full bg-brand-400" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={UserRound} label="Admin" value={hospital?.adminName || user?.fullName || ""} />
        <InfoCard icon={UserRound} label="CEO" value={hospital?.ceoName || ""} />
        <InfoCard icon={Mail} label="Email" value={hospital?.contactEmail || ""} />
        <InfoCard icon={Phone} label="Phone" value={hospital?.contactPhone || ""} />
      </section>

      <section className="rounded-lg border border-line bg-white p-6 shadow-panel">
        <div className="mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-brand-700" />
          <h3 className="text-base font-bold text-ink-strong">Current workspace</h3>
        </div>
        <p className="text-sm leading-6 text-ink-muted">
          Hospital profile, departments and doctors are the only active modules right now. Keep the setup clean from here.
        </p>
      </section>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <Icon size={18} />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-1 min-h-7 truncate text-lg font-bold text-ink-strong">{value}</p>
    </div>
  );
}
