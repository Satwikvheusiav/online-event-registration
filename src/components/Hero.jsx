import React from 'react';
import { Calendar, Users, Sparkles, ShieldCheck } from 'lucide-react';

export default function Hero({ totalEvents, onExploreClick }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 p-8 sm:p-12 mb-10 shadow-2xl">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          College Cloud Application Portal
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Discover & Register for <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">Campus Events</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
          Welcome to the official online event registration portal. Browse upcoming technical hackathons, workshops, cultural fests, and seminars. Reserve your seats instantly.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onExploreClick}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            Explore {totalEvents} Events
          </button>

          <div className="flex items-center gap-6 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant Seat Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Real-time Capacity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
