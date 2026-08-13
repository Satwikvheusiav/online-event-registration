import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Calendar, 
  Ticket, 
  PieChart, 
  RefreshCw, 
  Search, 
  Shield, 
  Clock, 
  MapPin, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard({ 
  events, 
  registrations, 
  onCreateEvent, 
  onEditEvent, 
  onDeleteEvent, 
  onResetSeedData 
}) {
  const [activeAdminView, setActiveAdminView] = useState('events'); // 'events' or 'registrations'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');

  // Statistics calculation
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const totalCapacity = events.reduce((acc, curr) => acc + (parseInt(curr.capacity, 10) || 0), 0);
  const totalSeatsBooked = events.reduce((acc, curr) => {
    const cap = parseInt(curr.capacity, 10) || 0;
    const avail = parseInt(curr.availableSeats, 10) || 0;
    return acc + (cap - avail);
  }, 0);
  const fullEventsCount = events.filter(e => e.availableSeats <= 0).length;
  const occupancyPercentage = totalCapacity > 0 ? Math.round((totalSeatsBooked / totalCapacity) * 100) : 0;

  // Filtered Events
  const filteredEvents = events.filter(evt => 
    evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Registrations
  const filteredRegistrations = registrations.filter(reg => {
    const matchesQuery = reg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.eventName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEvent = selectedEventFilter === 'all' || reg.eventId === selectedEventFilter;

    return matchesQuery && matchesEvent;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" /> Admin Control Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Event Management Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Create events, monitor registration statistics & handle attendee bookings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetSeedData}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Reset to default sample events and clear registrations"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            Reset Sample Data
          </button>

          <button
            onClick={onCreateEvent}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Events</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalEvents}</div>
          <div className="text-[11px] text-slate-400 mt-1">{fullEventsCount} events currently full</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Registrations</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalRegistrations}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Confirmed student bookings</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Seats Reserved</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalSeatsBooked} <span className="text-sm font-normal text-slate-400">/ {totalCapacity}</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Across all active venues</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Capacity Utilization</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{occupancyPercentage}%</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full" style={{ width: `${occupancyPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Sub-Navigation & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveAdminView('events')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeAdminView === 'events'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Manage Events ({events.length})
          </button>
          <button
            onClick={() => setActiveAdminView('registrations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeAdminView === 'registrations'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Attendee Master List ({registrations.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder={activeAdminView === 'events' ? "Search events..." : "Search attendees or events..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* VIEW 1: MANAGE EVENTS TABLE */}
      {activeAdminView === 'events' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Event Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Capacity & Seats</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No events found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => {
                    const isFull = evt.availableSeats <= 0;
                    return (
                      <tr key={evt.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-semibold text-white">
                          <div>{evt.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal line-clamp-1 max-w-xs">
                            {evt.description}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {evt.category || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{evt.date}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{evt.time}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>{evt.venue}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">
                            {evt.capacity - evt.availableSeats} / {evt.capacity} booked
                          </div>
                          <div className="text-[11px] mt-0.5">
                            {isFull ? (
                              <span className="text-rose-400 font-semibold">Fully Booked</span>
                            ) : (
                              <span className="text-emerald-400">{evt.availableSeats} Seats Open</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onEditEvent(evt)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="Edit Event"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteEvent(evt.id)}
                              className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-900/40 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: ALL REGISTRATIONS TABLE */}
      {activeAdminView === 'registrations' && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 space-y-4">
          
          {/* Event Filter Dropdown */}
          <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex items-center gap-3">
            <span className="text-xs text-slate-400">Filter by Event:</span>
            <select
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Events ({registrations.length} registrations)</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Attendee Name</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Registered Event</th>
                  <th className="py-3.5 px-4">Event Date & Venue</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      No attendee registrations recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {reg.userName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {reg.userEmail}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-amber-300">
                        {reg.eventName}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>{reg.eventDate}</div>
                        <div className="text-[11px] text-slate-500">{reg.eventVenue}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(reg.registeredAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
