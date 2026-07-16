import ReactDatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const parseDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toDateValue = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DatePicker({ value, onChange, placeholder = "Select date" }) {
  return (
    <div className="hms-datepicker relative">
      <ReactDatePicker
        selected={parseDate(value)}
        onChange={(date) => onChange(toDateValue(date))}
        dateFormat="dd MMM yyyy"
        placeholderText={placeholder}
        showPopperArrow={false}
        isClearable
        className="hms-input pr-10"
      />
      <CalendarDays size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" />
    </div>
  );
}
