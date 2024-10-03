import React from "react";
import { useMutation } from "@tanstack/react-query";
import { addSingleWorkLog } from "../lib/api";
import { tasks, type Hours } from "./schema";
import { useToken } from "@/stores/token";

interface SingleDayMutationProps {
  day: string;
  hours: Hours;
  onComplete: () => void;
  startTime: number;
}

const SingleDayMutation: React.FC<SingleDayMutationProps> = ({
  day,
  hours,
  onComplete,
  startTime,
}) => {
  const token = useToken();

  const { mutateAsync } = useMutation({
    mutationFn: ({
      day,
      task,
      hours,
      time,
    }: {
      day: string;
      task: string;
      hours: number;
      time: number;
    }) => addSingleWorkLog(token!, day, task, hours, time),
  });

  React.useEffect(() => {
    const saveEveryTask = async () => {
      const toSaveTasks = Object.entries(hours).map(([taskNumber, hour]) => {
        const task = tasks.find((task) => task.name === taskNumber);
        if (!task || hour === 0) {
          return null;
        }

        return { task: task.taskId, hours: hour };
      });

      let time = startTime;
      for (const task of toSaveTasks) {
        if (task) {
          await mutateAsync({
            day,
            task: task.task,
            hours: task.hours,
            time: time,
          });
          time += task.hours;
        }
      }
      onComplete();
    };

    saveEveryTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default SingleDayMutation;
