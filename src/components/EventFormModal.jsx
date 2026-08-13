import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Tag, FileText, AlertCircle } from 'lucide-react';

export default function EventFormModal({ 
  event, 
  onClose, 
  onSave 
}) {
  const isEditing = Boolean(event && event.id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('50');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setName(event.name || '');
      setDescription(event.description || '');
      setCategory(event.category || 'Technical');
      setDate(event.date || '');
      setTime(event.time || '10:00 AM');
      setVenue(event.venue || '');
      setCapacity(event.capacity ? String(event.capacity) : '50');
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !description || !date || !time || !venue || !capacity) {
      setError('Please fill in all event details.');
      return;
    }

    const capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
      setError('Maximum capacity must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        ...(isEditing ? { id: event.id, availableSeats: event.availableSeats } : {}),
        name,
        description,
        category,
        date,
        time,
        venue,
        capacity: capNum
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 relative border border-slate-700/60 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Event Details' : 'Create New Campus Event'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in the event information to publish it for student registrations
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Event Name */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Event Title *</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. Cloud Computing & DevOps Workshop"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Event Description *</label>
            <textarea
              rows="3"
              placeholder="Provide a comprehensive summary of topics covered, prerequisites, and speaker info..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Category & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Category *</label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                >
                  <option value="Technical">Technical</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Sports">Sports</option>
                  <option value="Management">Management</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Maximum Capacity *</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Date *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Time *</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Venue Location *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. Main Auditorium A, Ground Floor"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Event'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
