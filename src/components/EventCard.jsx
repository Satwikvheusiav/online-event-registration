import React from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, Info } from 'lucide-react';

export default function EventCard({ 
  event, 
  user, 
  isRegistered, 
  onSelectEvent, 
  onRegister 
}) {
  const isFull = event.availableSeats <= 0;
  const fillPercentage = Math.round(((event.capacity - event.availableSeats) / event.capacity) * 100);

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'technical':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'workshop':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cultural':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'seminar':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
      
      {/* Card Header & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getCategoryBadgeClass(event.category)}`}>
            {event.category || 'General'}
          </span>

          {isRegistered ? (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5" />
              Registered
            </span>
          ) : isFull ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
              Full / Sold Out
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {event.availableSeats} Seats Left
            </span>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelectEvent(event)} 
          className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2 mb-2"
        >
          {event.name}
        </h3>

        {/* Description snippet */}
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Details Meta & Seat Progress */}
      <div>
        <div className="space-y-2 text-xs text-slate-300 mb-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{event.date}</span>
            <span className="text-slate-600">•</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Seat Capacity
            </span>
            <span className="font-semibold text-slate-200">
              {event.capacity - event.availableSeats} / {event.capacity}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isFull 
                  ? 'bg-rose-500' 
                  : fillPercentage > 80 
                  ? 'bg-amber-500' 
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectEvent(event)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="View Event Details"
          >
            <Info className="w-4 h-4" />
          </button>

          {isRegistered ? (
            <button
              disabled
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-default"
            >
              <CheckCircle className="w-4 h-4" />
              Already Registered
            </button>
          ) : isFull ? (
            <button
              disabled
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-slate-500 border border-slate-800 text-xs font-semibold cursor-not-allowed"
            >
              Event Full
            </button>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-1.5"
            >
              Register Now
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
