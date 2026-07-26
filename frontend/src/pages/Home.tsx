import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      {/* Background soft glow gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] -z-10" />
      
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold border rounded-full bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
          <span>Sprint 1 Complete</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Enterprise AI Engine
        </h1>
        
        <p className="max-w-xl mx-auto text-base text-slate-400 md:text-lg">
          A robust, production-ready boilerplate establishing seamless communications between React, ASP.NET Core Web API, and Python FastAPI.
        </p>

        {/* Tech stack badges */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4">
          <div className="p-3 border rounded-xl bg-slate-900/40 border-slate-800/80 backdrop-blur-sm">
            <span className="block text-sm font-bold text-indigo-400">Vite + React</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Frontend</span>
          </div>
          <div className="p-3 border rounded-xl bg-slate-900/40 border-slate-800/80 backdrop-blur-sm">
            <span className="block text-sm font-bold text-emerald-400">.NET 10 Web API</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Gateway</span>
          </div>
          <div className="p-3 border rounded-xl bg-slate-900/40 border-slate-800/80 backdrop-blur-sm">
            <span className="block text-sm font-bold text-sky-400">FastAPI</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">AI Service</span>
          </div>
        </div>

        <div className="pt-6">
          <Link
            to="/chat"
            className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/30"
          >
            Open Chat Engine
            <svg className="w-4 h-4 ml-2 -mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
