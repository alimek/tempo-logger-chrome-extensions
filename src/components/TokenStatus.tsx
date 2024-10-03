import { Separator } from "@/components/ui/separator";
import {
  useSetExpiryDate,
  useSetToken,
  useToken,
  useClearToken,
} from "@/stores/token";
import { useEffect } from "react";
import { RealTimeExpiryStatus } from "./RealTimeExpiryStatus";

export function TokenStatus() {
  const token = useToken();
  const setToken = useSetToken();
  const setExpiryDate = useSetExpiryDate();
  const clearToken = useClearToken();

  useEffect(() => {
    chrome.storage.local.get(["token", "expiryDate"], (data) => {
      if (new Date() > new Date(data.expiryDate)) {
        clearToken();
        return;
      }

      setToken(data.token);
      setExpiryDate(data.expiryDate);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (token) {
    return <RealTimeExpiryStatus />;
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p className="text-red-500 font-bold">
          Valid token not found, please refresh Tempo page and re-open
          extension.
        </p>
      </div>
      <Separator className="my-4 w-full" />
      <ol className="list-decimal list-inside">
        <li>You must be logged to JIRA to use this app.</li>
        <li>You must have the Tempo Time Logger app installed inside JIRA.</li>
        <li>You must have the Tempo app opened to get new token.</li>
        <li>
          Once you are on Temp app, open extension, it should automatically
          detect token and show you form to set all values.
        </li>
      </ol>
    </>
  );
}
