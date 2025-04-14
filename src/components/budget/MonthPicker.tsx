
import { MonthSelector } from "@/components/budget/MonthSelector";

interface MonthPickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function MonthPicker({ date, onDateChange }: MonthPickerProps) {
  return (
    <MonthSelector
      currentDate={date}
      onMonthChange={onDateChange}
    />
  );
}
