// Fallback persistent state when Firebase API key is not configured in .env

const STORAGE_KEYS = {
  EVENTS: 'campusevent_mock_events',
  REGISTRATIONS: 'campusevent_mock_registrations',
  CURRENT_USER: 'campusevent_mock_user'
};

const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    name: 'Cloud Computing & DevOps Summit',
    description: 'Learn scalable architecture, Kubernetes, AWS & GCP essentials from industry cloud experts.',
    category: 'Technical',
    date: '2026-09-15',
    time: '10:00 AM',
    venue: 'Main Auditorium A',
    capacity: 100,
    availableSeats: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-2',
    name: 'AI & Machine Learning Hands-on Workshop',
    description: 'Practical session covering Python, PyTorch, and building real-world LLM applications.',
    category: 'Workshop',
    date: '2026-09-20',
    time: '02:00 PM',
    venue: 'Computer Science Lab 3',
    capacity: 50,
    availableSeats: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-3',
    name: 'Annual Campus Cultural Fest - Euphoria 2026',
    description: 'Grand evening featuring live music bands, dance competitions, fashion shows and food stalls.',
    category: 'Cultural',
    date: '2026-10-05',
    time: '05:00 PM',
    venue: 'Open Air Amphitheatre',
    capacity: 500,
    availableSeats: 500,
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-4',
    name: 'Inter-College 24-Hour Hackathon',
    description: 'Build innovative web & mobile applications in 24 hours. Exciting cash prizes & internship offers!',
    category: 'Technical',
    date: '2026-09-28',
    time: '09:00 AM',
    venue: 'IT Block Seminar Hall',
    capacity: 80,
    availableSeats: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt-5',
    name: 'Cybersecurity & Ethical Hacking Seminar',
    description: 'Understand modern web vulnerabilities, network defense strategies and penetration testing basics.',
    category: 'Seminar',
    date: '2026-10-12',
    time: '11:30 AM',
    venue: 'Audio-Visual Hall 2',
    capacity: 60,
    availableSeats: 60,
    createdAt: new Date().toISOString()
  }
];

export const getStoredEvents = () => {
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    const events = JSON.parse(data);
    // If events in storage still have old partial seat data, reset availableSeats to capacity
    const resetEvents = events.map(e => ({
      ...e,
      availableSeats: e.capacity
    }));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(resetEvents));
    return resetEvents;
  } catch (e) {
    return INITIAL_EVENTS;
  }
};

export const saveStoredEvents = (events) => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

export const getStoredRegistrations = () => {
  const data = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveStoredRegistrations = (registrations) => {
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
};

export const resetToDefaultSeedData = () => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
  return INITIAL_EVENTS;
};
