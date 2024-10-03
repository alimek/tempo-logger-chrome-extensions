import { TokenStatus } from "./components/TokenStatus";
import { DayConfig } from "./components/DayConfig";
import { useToken } from "./stores/token";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

function App() {
  const token = useToken();
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Tempo Logger</h1>
          <TokenStatus />
        </div>
        {!!token && <DayConfig />}
      </div>
    </QueryClientProvider>
  );
}

export default App;
