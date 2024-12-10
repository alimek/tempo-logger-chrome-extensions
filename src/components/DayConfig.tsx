"use client";

import { Button } from "@/components/ui/button";
import { TaskHourInput } from "./TaskHourInput";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { DatePicker } from "./ui/datepicker";
import { schema, tasks, type DayConfig } from "./schema";
import { useState } from "react";
import SaveModal from "./SaveModal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function DayConfig() {
  const [isOpen, setIsOpen] = useState(false);
  const initStartDate = new Date();
  const initEndDate = new Date();
  initEndDate.setDate(initEndDate.getDate() + 7);
  const form = useForm<DayConfig>({
    defaultValues: {
      hours: {
        "TT-7": 0,
        "TT-2": 0,
        "TT-3": 0,
        "TT-4": 0,
        "TT-5": 0,
      },
      startDate: initStartDate,
      endDate: initEndDate,
      startTime: 8,
    },
    resolver: zodResolver(schema),
  });

  const hours = form.watch("hours");
  const totalHours = Object.values(hours).reduce(
    (sum, current) => sum + current,
    0
  );

  const handleSave = form.handleSubmit(() => {
    setIsOpen(true);
  });

  const hasError = totalHours > 8 || totalHours <= 0;

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  return (
    <form onSubmit={handleSave} className="flex flex-col justify-end gap-4">
      <div className="flex flex-col justify-end gap-4">
        <h2 className="text-xl font-semibold text-right">
          Day range configuration
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabled={[
                    {
                      after: endDate,
                    },
                  ]}
                />
              )}
            />
            <Controller
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabled={[
                    {
                      before: startDate,
                    },
                  ]}
                />
              )}
            />
          </div>

          <Controller
            name="startTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-row items-center gap-2">
                <Label className="flex-1 text-right" htmlFor="start-time">
                  Start logging tasks from (AM)
                </Label>
                <Input
                  id="startTime"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  pattern="[0-9]*"
                  className={cn("w-20", !!fieldState.error && "border-red-500")}
                />
              </div>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-right">
          Hours configuration
        </h2>
        <div className="flex flex-col gap-2">
          {tasks.map((group) => (
            <Controller
              key={group.name}
              name={`hours.${group.name}`}
              control={form.control}
              render={({ field, fieldState }) => (
                <TaskHourInput
                  taskNumber={group.name}
                  description={group.description}
                  hours={field.value}
                  onHoursChange={field.onChange}
                  hasError={!!fieldState.error}
                />
              )}
            />
          ))}
        </div>
        <div className="font-semibold flex flex-row items-center gap-2">
          {hasError && (
            <span className="flex-1 text-red-500">
              {totalHours > 8
                ? "Total hours cannot be greater than 8."
                : "Total hours must be greater than 0."}
            </span>
          )}
          <span className={cn(!hasError && "flex-1 text-right")}>
            Total: {totalHours} hours
          </span>
        </div>
      </div>

      <Button type="submit">Submit</Button>
      <SaveModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        config={form.getValues()}
      />
    </form>
  );
}
