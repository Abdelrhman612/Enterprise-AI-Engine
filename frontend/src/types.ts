export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export type UploadStatus = {
  fileCount: number;
  totalChunks: number;
  message: string;
};
