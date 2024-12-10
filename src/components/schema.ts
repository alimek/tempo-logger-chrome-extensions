import { z } from "zod";

export const tasks = [
  { name: "TT-7", description: "New development", taskId: "384502" },
  { name: "TT-2", description: "Maintenance work", taskId: "378775" },
  { name: "TT-3", description: "Other work", taskId: "378776" },
  { name: "TT-4", description: "Holiday", taskId: "378777" },
  { name: "TT-5", description: "Non-working day", taskId: "378778" },
] as const;

const hoursSchema = z.object(
  Object.fromEntries(tasks.map((task) => [task.name, z.number().min(0).max(8)]))
);

export const schema = z
  .object({
    hours: hoursSchema,
    startDate: z.date(),
    endDate: z.date(),
    startTime: z.preprocess(
      (x) => (x ? x : undefined),
      z.coerce.number().int().min(1).max(23)
    ),
  })
  .required()
  .superRefine((data, ctx) => {
    const totalHours = Object.values(data.hours).reduce(
      (sum, current) => sum + current,
      0
    );

    if (totalHours > 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total hours cannot be greater than 24",
      });
    }

    if (totalHours <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total hours cannot be less than 0",
      });
    }
  });

export type Hours = z.infer<typeof hoursSchema>;
export type DayConfig = z.infer<typeof schema>;
