const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL || "http://localhost:5000";

export const getAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = ASSET_BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
};

const request = async (path, options = {}) => {
  const token = localStorage.getItem("hms_access_token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }
  return payload?.data ?? payload;
};

export const api = {
  registerAdmin: (body) => request("/admin/register", { method: "POST", body: JSON.stringify(body) }),
  loginAdmin: (body) => request("/admin/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/admin/me"),
  updateAdminProfile: (body) => request("/admin/profile", { method: "PUT", body: JSON.stringify(body) }),

  getHospitalProfile: () => request("/admin/hospital-profile"),
  updateHospitalProfile: (body) => request("/admin/hospital-profile", { method: "PUT", body: JSON.stringify(body) }),
  uploadHospitalLogo: (file) => {
    const form = new FormData();
    form.append("logo", file);
    return request("/admin/hospital-profile/logo", { method: "POST", body: form });
  },

  listDepartments: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.status) query.set("status", params.status);
    const qs = query.toString();
    return request(`/departments${qs ? `?${qs}` : ""}`);
  },
  getDepartment: (id) => request(`/departments/${id}`),
  createDepartment: (body) => request("/departments", { method: "POST", body: JSON.stringify(body) }),
  updateDepartment: (id, body) => request(`/departments/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteDepartment: (id) => request(`/departments/${id}`, { method: "DELETE" }),
  toggleDepartment: (id) => request(`/departments/${id}/toggle`, { method: "PATCH", body: "{}" }),
  uploadDepartmentIcon: (id, file) => {
    const form = new FormData();
    form.append("icon", file);
    return request(`/departments/${id}/icon`, { method: "POST", body: form });
  },

  listDoctors: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.specialization) query.set("specialization", params.specialization);
    const qs = query.toString();
    return request(`/doctors${qs ? `?${qs}` : ""}`);
  },
  createDoctor: (body) => request("/doctors", { method: "POST", body: JSON.stringify(body) }),
  getDoctor: (id) => request(`/doctors/${id}`),
  updateDoctor: (id, body) => request(`/doctors/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteDoctor: (id) => request(`/doctors/${id}`, { method: "DELETE" })
};

export { API_BASE_URL, ASSET_BASE_URL };
