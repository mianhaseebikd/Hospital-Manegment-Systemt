export default function TextInput({ className = "", ...props }) {
  return (
    <input
      className={["hms-input", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
