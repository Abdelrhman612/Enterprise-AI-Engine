import { useCallback, useMemo, useState, type DragEvent } from "react";

type Props = {
  onUpload: (files: FileList | null) => void;
  disabled?: boolean;
  uploadStatus?: {
    fileCount: number;
    totalChunks: number;
    message: string;
  };
};

export default function DocumentUploadPanel({ onUpload, disabled, uploadStatus }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      onUpload(event.dataTransfer.files);
    },
    [onUpload]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const statusLabel = useMemo(() => {
    if (!uploadStatus) return "Upload documents to build the knowledge base.";
    return `${uploadStatus.fileCount} file(s) indexed · ${uploadStatus.totalChunks} vector chunks`;
  }, [uploadStatus]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-950/70 p-6 shadow-xl shadow-slate-900/10 backdrop-blur-xl text-slate-50">
      <div
        className={`group border-2 ${isDragging ? "border-cyan-400 bg-cyan-500/10" : "border-slate-700 bg-slate-900/80"} rounded-3xl p-6 transition-all duration-200`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Knowledge ingestion</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Drag and drop files</h2>
            <p className="mt-2 text-sm text-slate-300">Upload documents to build a high-performance searchable vector store.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label
              htmlFor="upload"
              className={`inline-flex cursor-pointer items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Choose files
            </label>
            <span className="text-sm text-slate-300">Accepts text-based documents and JSON.</span>
          </div>

          <input
            id="upload"
            type="file"
            multiple
            disabled={disabled}
            className="sr-only"
            onChange={(event) => onUpload(event.target.files)}
          />

          <div className="rounded-2xl bg-slate-800/90 p-4 text-sm text-slate-300">
            {statusLabel}
          </div>
        </div>
      </div>

      {uploadStatus ? (
        <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 text-sm text-slate-200">
          <p className="font-medium text-slate-100">Latest upload:</p>
          <p>{uploadStatus.message}</p>
        </div>
      ) : null}
    </section>
  );
}
