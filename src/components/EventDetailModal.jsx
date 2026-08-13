import React from 'react';
import { X, Calendar, Clock, MapPin, Users, CheckCircle, ShieldAlert } from 'lucide-react';

export default function EventDetailModal({ 
  event, 
  user, 
  isRegistered, 
  onClose, 
  onRegister 
}) {
  if (!event) return null;

  const isFull = event.availableSeats <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 relative border border-slate-700/60 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {event.category || 'General'}
            </span>
            {isRegistered ? (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Registered
              </span>
            ) : isFull ? (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                Full Capacity
              </span>
            ) : null}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 pr-8">
            {event.name}
          </h2>

          {/* Key Event Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Date</div>
                <div className="font-semibold text-slate-200">{event.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Time</div>
                <div className="font-semibold text-slate-200">{event.time}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Venue</div>
                <div className="font-semibold text-slate-200">{event.venue}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Event Overview
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Capacity Stats */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 mb-6">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-4 h-4 text-indigo-400" /> Maximum Capacity: {event.capacity} seats
              </span>
              <span className="font-bold text-indigo-300">
                {event.availableSeats} Seats Available
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full ${isFull ? 'bg-rose-500' : 'bg-indigo-500'}`}
                style={{ width: `${Math.round(((event.capacity - event.availableSeats) / event.capacity) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            Close
          </button>

          {isRegistered ? (
            <div className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              You are officially registered for this event
            </div>
          ) : isFull ? (
            <div className="flex-1 py-2.5 px-4 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Event capacity is full
            </div>
          ) : (
            <button
              onClick={() => {
                onRegister(event);
                onClose();
              }}
              className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              Confirm Registration
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
