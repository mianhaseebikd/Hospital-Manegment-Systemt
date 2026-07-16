export default function Field({ label, required, hint, children }) {
  return (
    <div className="grid gap-1.5">
      <span className="flex items-center gap-1 text-[13px] font-medium text-ink-muted">
        {label}
        {required && <span className="text-coral-500">*</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
    </div>
  );
}
