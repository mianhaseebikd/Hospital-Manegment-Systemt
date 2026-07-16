import { Building2, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/forms/Field.jsx";
import TextInput from "../components/forms/TextInput.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function LoginPage() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-brand-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Hospital admin module
          </div>
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl font-bold tracking-normal text-white sm:text-5xl">Login to your hospital workspace</h1>
            <p className="text-base leading-7 text-navy-100">
              Dummy login is enabled for now. No password and no OTP. Authentication can be added later when the module is complete.
            </p>
          </div>
          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            {["Profile", "Branding", "Settings"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{item}</p>
                <p className="mt-1 text-xs text-navy-100/60">Ready</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 text-ink-strong shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-400 text-navy-900">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Login</h2>
              <p className="text-sm text-ink-muted">Passwordless demo access</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <Field label="Admin Email">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <TextInput
                  className="pl-9"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </Field>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy-800 text-sm font-bold text-white transition hover:bg-navy-700 disabled:opacity-60"
            >
              <LogIn size={17} />
              {loading ? "Opening dashboard..." : "Login as Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Need a fresh admin?{" "}
            <Link to="/register" className="font-semibold text-brand-700 hover:underline">
              Register setup
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
