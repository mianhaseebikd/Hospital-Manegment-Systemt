import {
  Activity,
  Building2,
  ChevronDown,
  CircleUserRound,
  Eye,
  LayoutDashboard,
  LogOut,
  Plus,
  PenLine,
  Settings,
  Stethoscope
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const dashboardSubmenu = [
  { to: "/hospital", label: "Hospital Profile", icon: Building2 },
  { to: "/hospital/edit", label: "Edit Profile", icon: PenLine },
  { to: "/settings", label: "Admin Settings", icon: Settings }
];

const departmentSubmenu = [
  { to: "/departments", label: "View Departments", icon: Eye },
  { to: "/departments/new", label: "Add Department", icon: Plus }
];

const doctorSubmenu = [
  { to: "/doctors", label: "View Doctors", icon: Eye },
  { to: "/doctors/new", label: "Add Doctor", icon: Plus }
];

export default function AppShell({ children }) {
  const { user, hospital, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [doctorsOpen, setDoctorsOpen] = useState(false);
  const isDashboardArea = ["/dashboard", "/hospital", "/hospital/edit", "/settings"].includes(location.pathname);
  const isDepartmentsArea = location.pathname.startsWith("/departments");
  const isDoctorsArea = location.pathname.startsWith("/doctors");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "";

  return (
    <div className="flex min-h-screen bg-surface-page text-ink-strong">
      <aside className="hidden lg:flex lg:w-[240px] lg:shrink-0 lg:flex-col lg:bg-navy-800 lg:text-white lg:shadow-xl">
        <div className="border-b border-navy-700/60 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-400 shadow-glow">
              <Activity size={20} className="text-navy-900" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-wide text-white">{hospital?.name || ""}</p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-brand-400">Setup Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2.5 py-3" aria-label="Main navigation">
          <div>
            <button
              type="button"
              onClick={() => setDashboardOpen((value) => !value)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition ${
                isDashboardArea ? "bg-brand-400/20 text-brand-400" : "text-navy-100/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-md ${isDashboardArea ? "bg-brand-400 text-navy-900" : "bg-white/5"}`}>
                <LayoutDashboard size={15} />
              </span>
              <span className="flex-1 text-left">Dashboard</span>
              <ChevronDown size={15} className={`transition ${dashboardOpen ? "rotate-180" : ""}`} />
            </button>

            {dashboardOpen && (
              <div className="mt-1 space-y-1 border-l border-white/10 pb-1 pl-4">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                      isActive ? "bg-white/10 text-white" : "text-navy-100/60 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <LayoutDashboard size={14} />
                  Overview
                </NavLink>
                {dashboardSubmenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/hospital"}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                          isActive ? "bg-white/10 text-white" : "text-navy-100/60 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={14} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setDepartmentsOpen((value) => !value)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition ${
                isDepartmentsArea ? "bg-brand-400/20 text-brand-400" : "text-navy-100/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-md ${isDepartmentsArea ? "bg-brand-400 text-navy-900" : "bg-white/5"}`}>
                <Building2 size={15} />
              </span>
              <span className="flex-1 text-left">Departments</span>
              <ChevronDown size={15} className={`transition ${departmentsOpen ? "rotate-180" : ""}`} />
            </button>

            {departmentsOpen && (
              <div className="mt-1 space-y-1 border-l border-white/10 pb-1 pl-4">
                {departmentSubmenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/departments"}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                          isActive ? "bg-white/10 text-white" : "text-navy-100/60 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={14} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setDoctorsOpen((value) => !value)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition ${
                isDoctorsArea ? "bg-brand-400/20 text-brand-400" : "text-navy-100/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-md ${isDoctorsArea ? "bg-brand-400 text-navy-900" : "bg-white/5"}`}>
                <Stethoscope size={15} />
              </span>
              <span className="flex-1 text-left">Doctors</span>
              <ChevronDown size={15} className={`transition ${doctorsOpen ? "rotate-180" : ""}`} />
            </button>

            {doctorsOpen && (
              <div className="mt-1 space-y-1 border-l border-white/10 pb-1 pl-4">
                {doctorSubmenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/doctors"}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                          isActive ? "bg-white/10 text-white" : "text-navy-100/60 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={14} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="border-t border-navy-700/60 p-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy-600 text-[11px] font-bold text-brand-400">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user?.fullName}</p>
              <p className="truncate text-[10px] text-navy-100/50">{user?.email}</p>
            </div>
            <button type="button" onClick={handleLogout} className="text-navy-100/40 hover:text-white" aria-label="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-line bg-white px-4 py-2.5 shadow-sm sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Hospital Module</p>
              <h1 className="truncate text-base font-bold text-ink-strong">{hospital?.name || ""}</h1>
            </div>
            <div className="flex items-center gap-2">
              <nav className="flex gap-1 overflow-x-auto lg:hidden">
                {[{ to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }, ...dashboardSubmenu, ...departmentSubmenu, ...doctorSubmenu].map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/dashboard" || item.to === "/hospital"}
                      className={({ isActive }) =>
                        `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isActive ? "bg-navy-800 text-white" : "bg-surface-muted text-ink-muted"
                        }`
                      }
                      aria-label={item.label}
                    >
                      <Icon size={16} />
                    </NavLink>
                  );
                })}
              </nav>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink-base hover:bg-surface-muted"
              >
                <CircleUserRound size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-5">{children}</main>
      </div>
    </div>
  );
}
