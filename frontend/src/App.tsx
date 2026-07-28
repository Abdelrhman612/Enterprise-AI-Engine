
import { useCallback, useMemo, useState } from "react";
import api from "./api/api";
import { useAutoScroll } from "./hooks/useAutoScroll";
import ChatPanel from "./components/ChatPanel";
import DocumentUploadPanel from "./components/DocumentUploadPanel";
import { ChatMessage, UploadStatus } from "./types";
import "./index.css";

const initialSystemMessage: ChatMessage = {
  id: "system-001",
  role: "system",
  content: "Enterprise AI Engine is ready. Upload documents, then ask a question to start the retrieval augmented generation workflow.",
};

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialSystemMessage]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const chatContainerRef = useAutoScroll(isBusy);

  const safeAddMessage = useCallback((message: ChatMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    setErrorMessage(null);
    setIsBusy(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const response = await api.post<UploadStatus>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadStatus(response.data);
      safeAddMessage({
        id: `upload-${Date.now()}`,
        role: "assistant",
        content: `Indexed ${response.data.fileCount} file(s) into ${response.data.totalChunks} vector chunks.`,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsBusy(false);
    }
  }, [safeAddMessage]);

  const handleAsk = useCallback(async () => {
    if (!inputValue.trim()) {
      return;
    }

    setErrorMessage(null);
    setIsBusy(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
    };

    safeAddMessage(userMessage);
    setInputValue("");

    try {
      const response = await api.post("/ask", {
        query: userMessage.content,
        topK: 5,
      });

      safeAddMessage({
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.data.answer,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to complete your request.");
    } finally {
      setIsBusy(false);
    }
  }, [inputValue, safeAddMessage]);

  const disableInputs = isBusy;

  const tipText = useMemo(() => {
    if (uploadStatus) {
      return "You can now ask questions against uploaded documents.";
    }
    return "Start by uploading files to create your enterprise memory.";
  }, [uploadStatus]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-slate-900/20 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Enterprise AI Engine</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Production-ready Enterprise RAG</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Upload documents for vector indexing, then ask natural language questions. The orchestrator forwards requests to the AI service for fast retrieval and Groq inference.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-5 text-sm text-slate-300 shadow-inner shadow-slate-950/20">
              <p className="font-semibold text-slate-100">Status</p>
              <p className="mt-2">{isBusy ? "Working on your request..." : "Idle and ready."}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-6">
            <DocumentUploadPanel onUpload={handleUpload} disabled={disableInputs} uploadStatus={uploadStatus ?? undefined} />
            <section className="rounded-3xl border border-slate-200/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Knowledge Base</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Managed documents</h2>
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-300">{tipText}</p>
            </section>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/10">
              <div className="flex flex-col gap-4">
                <ChatPanel messages={messages} isLoading={isBusy} containerRef={chatContainerRef} />
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <textarea
                    className="min-h-[120px] rounded-3xl border border-slate-800 bg-slate-900/95 p-4 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Type your question here..."
                    value={inputValue}
                    disabled={disableInputs}
                    onChange={(event) => setInputValue(event.target.value)}
                  />
                  <button
                    className="rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleAsk}
                    disabled={disableInputs || !inputValue.trim()}
                  >
                    Send question
                  </button>
                </div>
                {errorMessage ? (
                  <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                    {errorMessage}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
