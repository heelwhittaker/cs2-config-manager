/// <reference types="vite/client" />
export {};

declare global {
  interface Window {
    api: {
      openFile: () => Promise<{ path: string; content: string } | null>;
      saveFile: (payload: { filename: string; content: string }) => Promise<string | null>;
    };
  }
}
