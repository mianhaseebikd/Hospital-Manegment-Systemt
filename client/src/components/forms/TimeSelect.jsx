import ReactDatePicker from "react-datepicker";
import { Clock3 } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const pad = (number) => String(number).padStart(2, "0");

const parseTime = (value) => {
  if (!value) return null;
  const [hour = 0, minute = 0] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
};

const toTimeValue = (date) => {
  if (!date) return "";
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatTimeLabel = (value) => value || "";

export default function TimeSelect({ value, onChange, placeholder = "Select time" }) {
  return (
    <div className="hms-datepicker relative">
      <ReactDatePicker
        selected={parseTime(value)}
        onChange={(date) => onChange(toTimeValue(date))}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        placeholderText={placeholder}
        showPopperArrow={false}
        isClearable
        className="hms-input pr-10"
      />
      <Clock3 size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" />
    </div>
  );
}
