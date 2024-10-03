import React, { useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { DayConfig } from "./schema";
import SingleDayMutation from "./SingleDayMutation";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DayConfig;
}

const generateDatesWithoutWeekends = (
  startDate: Date,
  endDate: Date
): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, config }) => {
  const [saved, setSaved] = useState(false);
  const [completedDays, setCompletedDays] = useState(0);
  const daysToSave = useMemo(() => {
    if (isOpen) {
      setCompletedDays(0);
      return generateDatesWithoutWeekends(config.startDate, config.endDate);
    }

    return [];
  }, [config.startDate, config.endDate, isOpen]);

  const handleDayComplete = async () => {
    setCompletedDays((prev) => prev + 1);
    const isComplete = completedDays + 1 === daysToSave.length;
    if (isComplete) {
      const tab = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tabId = tab[0] && tab[0].id;
      if (tabId) {
        chrome.tabs.reload(tabId);
        setSaved(true);
      }
    }
  };

  const isComplete = completedDays === daysToSave.length;
  const progress = Math.round((completedDays / daysToSave.length) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saving Progress</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="text-sm text-gray-500">
              {completedDays} / {daysToSave.length} days
            </div>
          </div>
          {daysToSave.map((day) => (
            <SingleDayMutation
              day={day.toISOString()}
              hours={config.hours}
              startTime={config.startTime}
              onComplete={handleDayComplete}
            />
          ))}
        </div>
        {saved && (
          <div className="text-green-500 text-xl font-bold text-center">
            Saved!
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} disabled={!isComplete}>
            {isComplete ? "Close" : "Saving..."}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveModal;
