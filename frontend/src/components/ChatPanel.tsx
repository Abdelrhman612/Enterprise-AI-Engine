import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../types";

type Props = {
  messages: ChatMessage[];
  isLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
};

export default function ChatPanel({ messages, isLoading, containerRef }: Props) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-900/10">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Enterprise AI Chat</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Ask your documents</h2>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
          {isLoading ? "Processing..." : "Ready"}
        </span>
      </div>

      <div className="flex-1 overflow-hidden rounded-3xl bg-slate-900/90 p-4">
        <div ref={containerRef} className="max-h-[58vh] space-y-4 overflow-y-auto pr-2">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-3xl p-4 ${message.role === "user" ? "bg-slate-900 text-slate-100" : "bg-slate-950 ring-1 ring-slate-800 text-slate-200"}`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{message.role}</p>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
