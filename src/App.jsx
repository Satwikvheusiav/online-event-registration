import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventCard from './components/EventCard';
import EventDetailModal from './components/EventDetailModal';
import AuthModal from './components/AuthModal';
import MyRegistrations from './components/MyRegistrations';
import AdminDashboard from './components/AdminDashboard';
import EventFormModal from './components/EventFormModal';
import Toast from './components/Toast';

import { 
  onAuthChange, 
  loginUser, 
  registerUser, 
  logoutUser, 
  loginAsDemoUser, 
  loginAsDemoAdmin 
} from './services/authService';
import { 
  fetchEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  resetSampleData 
} from './services/eventService';
import { 
  registerForEvent, 
  cancelRegistration, 
  getUserRegistrations, 
  getAllRegistrations 
} from './services/registrationService';
import { Search, Filter, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Technical', 'Workshop', 'Cultural', 'Seminar', 'Sports', 'Management'];

export default function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'my-registrations' | 'admin'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEventFormModal, setShowEventFormModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // 1. Auth Subscription
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Load Events Data
  const loadEventsData = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (e) {
      console.error("Failed to load events:", e);
      showToast("Error loading events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventsData();
  }, []);

  // 3. Load Registrations when user or role changes
  const loadRegistrations = async () => {
    if (!user) {
      setUserRegistrations([]);
      setAllRegistrations([]);
      return;
    }

    try {
      const uRegs = await getUserRegistrations(user.uid);
      setUserRegistrations(uRegs);

      if (user.role === 'admin') {
        const aRegs = await getAllRegistrations();
        setAllRegistrations(aRegs);
      }
    } catch (e) {
      console.error("Error loading registrations:", e);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [user]);

  // Auth Action Handlers
  const handleLogin = async (email, password) => {
    const loggedUser = await loginUser(email, password);
    setUser(loggedUser);
    showToast(`Welcome back, ${loggedUser.name}!`);
  };

  const handleRegister = async (name, email, password, role) => {
    const newUser = await registerUser(name, email, password, role);
    setUser(newUser);
    showToast(`Account created successfully! Logged in as ${newUser.role}`);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setActiveTab('events');
    showToast("Logged out successfully");
  };

  const handleDemoUser = () => {
    const demo = loginAsDemoUser();
    setUser(demo);
    showToast("Logged in as Demo Student");
  };

  const handleDemoAdmin = () => {
    const admin = loginAsDemoAdmin();
    setUser(admin);
    setActiveTab('admin');
    showToast("Logged in as Demo Administrator");
  };

  // Event Registration Action Handler
  const handleRegisterEvent = async (event) => {
    if (!user) {
      setShowAuthModal(true);
      showToast("Please sign in or use demo login to register for events", "info");
      return;
    }

    try {
      const newReg = await registerForEvent(event, user);
      showToast(`Successfully registered for "${event.name}"!`);
      // Refresh state
      await loadEventsData();
      await loadRegistrations();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Cancel Registration Action Handler
  const handleCancelRegistration = async (registrationId, eventId) => {
    try {
      await cancelRegistration(registrationId, eventId);
      showToast("Registration cancelled successfully. 1 seat restored.");
      await loadEventsData();
      await loadRegistrations();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Admin Event Handlers
  const handleSaveEvent = async (eventData) => {
    try {
      if (eventData.id) {
        await updateEvent(eventData.id, eventData);
        showToast(`Event "${eventData.name}" updated successfully.`);
      } else {
        await createEvent(eventData);
        showToast(`Event "${eventData.name}" created successfully!`);
      }
      await loadEventsData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event? This will remove all associated statistics.")) {
      try {
        await deleteEvent(eventId);
        showToast("Event deleted successfully.");
        await loadEventsData();
        await loadRegistrations();
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  };

  const handleResetSeedData = async () => {
    if (window.confirm("Reset all events and registrations back to initial sample demo data?")) {
      const defaultEvents = await resetSampleData();
      setEvents(defaultEvents);
      await loadRegistrations();
      showToast("Reset to sample events and cleared test registrations.");
    }
  };

  // Filter Events Logic
  const filteredEvents = events.filter(evt => {
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesQuery = 
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Registered event IDs set for fast O(1) lookup
  const registeredEventIds = new Set(userRegistrations.map(r => r.eventId));

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onQuickDemoUser={handleDemoUser}
          onQuickDemoAdmin={handleDemoAdmin}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* TAB 1: BROWSE EVENTS */}
          {activeTab === 'events' && (
            <div>
              {/* Hero Banner */}
              <Hero 
                totalEvents={events.length} 
                onExploreClick={() => {
                  const searchElem = document.getElementById('search-filter-section');
                  if (searchElem) searchElem.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Search & Category Filter Controls */}
              <div id="search-filter-section" className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  
                  {/* Search input */}
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search events by title, venue..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                </div>
              </div>

              {/* Event Cards Grid */}
              {loading ? (
                <div className="text-center py-16 text-slate-400">
                  Loading events portal...
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-8 border border-slate-800">
                  <p className="text-slate-400 text-sm mb-4">No events found matching your filter criteria.</p>
                  <button
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((evt) => (
                    <EventCard
                      key={evt.id}
                      event={evt}
                      user={user}
                      isRegistered={registeredEventIds.has(evt.id)}
                      onSelectEvent={(e) => setSelectedEventModal(e)}
                      onRegister={handleRegisterEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY REGISTRATIONS */}
          {activeTab === 'my-registrations' && (
            <MyRegistrations
              registrations={userRegistrations}
              onCancelRegistration={handleCancelRegistration}
              onBrowseEvents={() => setActiveTab('events')}
            />
          )}

          {/* TAB 3: ADMIN DASHBOARD */}
          {activeTab === 'admin' && (
            <AdminDashboard
              events={events}
              registrations={allRegistrations}
              onCreateEvent={() => { setEditingEvent(null); setShowEventFormModal(true); }}
              onEditEvent={(evt) => { setEditingEvent(evt); setShowEventFormModal(true); }}
              onDeleteEvent={handleDeleteEvent}
              onResetSeedData={handleResetSeedData}
            />
          )}

        </main>
      </div>

      {/* App Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Campus Event Registration System • Cloud Application Project
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Firebase Auth & Firestore</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlay Components */}
      {selectedEventModal && (
        <EventDetailModal
          event={selectedEventModal}
          user={user}
          isRegistered={registeredEventIds.has(selectedEventModal.id)}
          onClose={() => setSelectedEventModal(null)}
          onRegister={handleRegisterEvent}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onQuickDemoUser={handleDemoUser}
          onQuickDemoAdmin={handleDemoAdmin}
        />
      )}

      {showEventFormModal && (
        <EventFormModal
          event={editingEvent}
          onClose={() => { setShowEventFormModal(false); setEditingEvent(null); }}
          onSave={handleSaveEvent}
        />
      )}

      {/* Toast Floating Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
