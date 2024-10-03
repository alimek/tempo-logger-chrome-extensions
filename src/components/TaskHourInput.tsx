import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TaskHourInputProps {
  taskNumber: string;
  description: string;
  hours: number;
  onHoursChange: (hours: number) => void;
  hasError: boolean;
}

export function TaskHourInput({
  taskNumber,
  description,
  hours,
  onHoursChange,
  hasError,
}: TaskHourInputProps) {
  return (
    <div className="flex flex-row items-center space-x-4">
      <div className="flex-1 flex flex-col text-right">
        <span className="font-semibold">{taskNumber}</span>
        <span className="text-xs">{description}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={hours}
          onChange={(e) => onHoursChange(parseFloat(e.target.value) || 0)}
          min="0"
          step="0.5"
          max="8"
          className={cn("w-20", hasError && "border-red-500")}
          aria-invalid={hasError}
        />
        <span>hours</span>
      </div>
    </div>
  );
}
