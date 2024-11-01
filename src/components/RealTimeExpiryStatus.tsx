import { useEffect, useState } from "react";
import { useClearToken, useExpiryDate, useWorkerId } from "../stores/token";

export function RealTimeExpiryStatus() {
  const expiryDate = useExpiryDate();
  const clearToken = useClearToken();
  const workerId = useWorkerId();

  const [expiryString, setExpiryString] = useState<string>("");

  useEffect(() => {
    const calculateExpiryString = () => {
      if (!expiryDate) {
        return;
      }

      if (new Date() > new Date(expiryDate)) {
        clearToken();
        return;
      }

      if (expiryDate) {
        const expirationTime = new Date(expiryDate).getTime();
        const now = Date.now();
        const timeLeft = expirationTime - now;
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const string = `Your token expire in ${days} day${
          days !== 1 ? "s" : ""
        } ${hours} hour${hours !== 1 ? "s" : ""} and ${minutes} minute${
          minutes !== 1 ? "s" : ""
        }.`;

        setExpiryString(string);
      }
    };

    calculateExpiryString();

    const intervalId = setInterval(calculateExpiryString, 2000); // Update every minute

    return () => clearInterval(intervalId);
  }, [clearToken, expiryDate]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-green-500">{expiryString}</span>
      <span className="text-sm">User ID: {workerId}</span>
    </div>
  );
}
