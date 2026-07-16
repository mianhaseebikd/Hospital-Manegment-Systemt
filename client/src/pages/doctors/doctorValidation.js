export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const phoneRegex = /^\+?[0-9][0-9\s()-]{6,18}$/;
export const cnicRegex = /^(\d{13}|\d{5}-\d{7}-\d{1})$/;

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "DR";

export const validateDoctorBasics = (values) => {
  const errors = {};

  if (!values.fullName?.trim()) errors.fullName = "Doctor name is required.";
  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone?.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!phoneRegex.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!values.cnic?.trim()) {
    errors.cnic = "CNIC is required.";
  } else if (!cnicRegex.test(values.cnic.trim())) {
    errors.cnic = "Use 13 digits or XXXXX-XXXXXXX-X format.";
  }

  // require duty timings and base salary on add
  if (!values.dutyTimings || !String(values.dutyTimings).trim()) {
    errors.dutyTimings = "Duty timings are required.";
  }

  const base = Number(values.baseSalary || 0);
  if (isNaN(base) || base <= 0) {
    errors.baseSalary = "Base salary must be a positive number.";
  }

  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;

export const fieldStateClass = (hasError) =>
  hasError
    ? "border-red-500 bg-red-50/40 text-red-700 ring-4 ring-red-100 focus:border-red-500 focus:ring-red-100"
    : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-500/20";
