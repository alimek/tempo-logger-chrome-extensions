import axios from "axios";

const workerId = import.meta.env.VITE_TEMPO_WORKER_ID;

export const addSingleWorkLog = async (
  token: string,
  day: string,
  originTaskId: string,
  hours: number,
  startTime: number = 8
) => {
  const started = new Date(day);
  started.setTime(started.getTime() + startTime * 60 * 60 * 1000);

  const utcDate = new Date(started.toISOString());
  utcDate.setUTCHours(parseInt(startTime.toString()));
  utcDate.setUTCMinutes((startTime % 1) * 60);

  const { data } = await axios.post(
    import.meta.env.VITE_TEMPO_URL,
    {
      attributes: {},
      billableSeconds: hours * 3600,
      workerId,
      started: utcDate,
      timeSpentSeconds: hours * 3600,
      originTaskId,
    },
    {
      headers: {
        Referer: "https://app.eu.tempo.io/io/web/tempo-app/",
        Origin: "https://app.eu.tempo.io",
        Authorization: `Tempo-Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};
