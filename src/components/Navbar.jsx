import React from 'react';
import { 
  Calendar, 
  User, 
  Shield, 
  LogOut, 
  Ticket, 
  LayoutDashboard, 
  Sparkles,
  Search
} from 'lucide-react';

export default function Navbar({ 
  user, 
  activeTab, 
  setActiveTab, 
  onOpenAuth, 
  onLogout,
  onQuickDemoUser,
  onQuickDemoAdmin 
}) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('events')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              CampusEvent
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Cloud Portal
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'events'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-4 h-4" />
            Browse Events
          </button>

          {user && user.role === 'user' && (
            <button
              onClick={() => setActiveTab('my-registrations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'my-registrations'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Ticket className="w-4 h-4" />
              My Registrations
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </button>
          )}
        </nav>

        {/* User / Auth State Controls */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1.5 mr-2">
                <button
                  onClick={onQuickDemoUser}
                  className="px-2.5 py-1 text-xs rounded-md bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/50 transition-colors flex items-center gap-1"
                  title="Quick login as student user for testing"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Demo User
                </button>
                <button
                  onClick={onQuickDemoAdmin}
                  className="px-2.5 py-1 text-xs rounded-md bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/50 transition-colors flex items-center gap-1"
                  title="Quick login as admin for testing"
                >
                  <Shield className="w-3 h-3 text-amber-400" />
                  Demo Admin
                </button>
              </div>

              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/25 active:scale-95"
              >
                <User className="w-4 h-4" />
                Login / Register
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                {user.role === 'admin' ? (
                  <span className="p-1 rounded-md bg-amber-500/10 text-amber-400">
                    <Shield className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400">
                    <User className="w-4 h-4" />
                  </span>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">{user.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{user.role} Account</div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 transition-all"
                title="Log Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Sub-navigation */}
      <div className="md:hidden flex items-center justify-around bg-slate-900/90 border-t border-slate-800 px-2 py-2">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
            activeTab === 'events' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Browse
        </button>

        {user && user.role === 'user' && (
          <button
            onClick={() => setActiveTab('my-registrations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'my-registrations' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" /> My Events
          </button>
        )}

        {user && user.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Admin
          </button>
        )}
      </div>
    </header>
  );
}
