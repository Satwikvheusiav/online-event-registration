import React from 'react';
import { Ticket, Calendar, Clock, MapPin, Trash2, ArrowRight } from 'lucide-react';

export default function MyRegistrations({ 
  registrations, 
  onCancelRegistration, 
  onBrowseEvents 
}) {
  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Ticket className="w-3.5 h-3.5" /> Student Event Passes
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Event Registrations
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your booked event tickets and check schedule details
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          Total Passes: <span className="font-bold text-emerald-400 text-sm ml-1">{registrations.length}</span>
        </div>
      </div>

      {/* List / Grid */}
      {registrations.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Active Registrations</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You haven't registered for any events yet. Explore upcoming campus events and reserve your seat today!
          </p>
          <button
            onClick={onBrowseEvents}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mx-auto"
          >
            Browse Events <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg) => (
            <div 
              key={reg.id}
              className="glass-card rounded-2xl p-6 relative border border-slate-800/80 flex flex-col justify-between"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-t-2xl" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {reg.eventCategory || 'Event'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: #{reg.id.slice(-6)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                  {reg.eventName}
                </h3>

                <div className="space-y-2 text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-slate-200">{reg.eventDate}</span>
                    <span className="text-slate-600">•</span>
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{reg.eventTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{reg.eventVenue}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Cancel action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                  Booked: {new Date(reg.registeredAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => onCancelRegistration(reg.id, reg.eventId)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 hover:text-white border border-rose-800/40 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Cancel Registration
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
