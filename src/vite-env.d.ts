/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEMPO_URL: string;
  readonly VITE_TEMPO_WORKER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
