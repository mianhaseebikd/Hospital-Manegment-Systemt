import { Building2, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/forms/Field.jsx";
import TextInput from "../components/forms/TextInput.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function RegisterPage() {
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hospitalName: "",
    fullName: "",
    email: "",
    phone: "",
    username: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerAdmin(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-page px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-400 text-navy-900 shadow-glow">
            <Building2 size={28} />
          </div>
          <div className="max-w-xl space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-700">Fresh setup</p>
            <h1 className="text-4xl font-bold tracking-normal text-ink-strong sm:text-5xl">Create the first hospital admin</h1>
            <p className="text-base leading-7 text-ink-muted">
              This is the new starting point. Register one dummy admin, open the dashboard, then complete the hospital profile.
            </p>
          </div>
          <div className="grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
              <p className="text-sm font-bold text-ink-strong">No password</p>
              <p className="mt-1 text-sm text-ink-muted">Temporary access until real authentication is added.</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
              <p className="text-sm font-bold text-ink-strong">Hospital only</p>
              <p className="mt-1 text-sm text-ink-muted">Other modules are removed from the active app flow.</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-ink-strong">Registration</h2>
            <p className="mt-1 text-sm text-ink-muted">Hospital and admin basics</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <Field label="Hospital Name">
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <TextInput
                  className="pl-9"
                  value={form.hospitalName}
                  onChange={(event) => set("hospitalName", event.target.value)}
                  required
                />
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Admin Name">
                <div className="relative">
                  <UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <TextInput
                    className="pl-9"
                    value={form.fullName}
                    onChange={(event) => set("fullName", event.target.value)}
                    required
                  />
                </div>
              </Field>
              <Field label="Username">
                <TextInput value={form.username} onChange={(event) => set("username", event.target.value)} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <TextInput
                    className="pl-9"
                    type="email"
                    value={form.email}
                    onChange={(event) => set("email", event.target.value)}
                    required
                  />
                </div>
              </Field>
              <Field label="Phone">
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <TextInput
                    className="pl-9"
                    value={form.phone}
                    onChange={(event) => set("phone", event.target.value)}
                    placeholder="03xx-xxxxxxx"
                  />
                </div>
              </Field>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full rounded-lg bg-navy-800 text-sm font-bold text-white transition hover:bg-navy-700 disabled:opacity-60"
            >
              {loading ? "Creating admin..." : "Create Admin and Open Dashboard"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-brand-700 hover:underline">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
