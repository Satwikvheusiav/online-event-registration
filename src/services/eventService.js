import { db, isFirebaseConfigured } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  getStoredEvents, 
  saveStoredEvents, 
  resetToDefaultSeedData 
} from './mockStore';

export const fetchEvents = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const events = [];
      querySnapshot.forEach((docSnap) => {
        events.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (events.length === 0) {
        // If Firestore is empty, seed initial events
        return await seedInitialEventsInFirestore();
      }
      return events;
    } catch (error) {
      console.warn("Firestore fetch error, falling back to local events:", error);
      return getStoredEvents();
    }
  } else {
    return getStoredEvents();
  }
};

const seedInitialEventsInFirestore = async () => {
  const initialEvents = getStoredEvents();
  const eventsRef = collection(db, 'events');
  const seeded = [];
  for (const evt of initialEvents) {
    const { id, ...evtData } = evt;
    const docRef = await addDoc(eventsRef, evtData);
    seeded.push({ id: docRef.id, ...evtData });
  }
  return seeded;
};

export const createEvent = async (eventData) => {
  const capacityNum = parseInt(eventData.capacity, 10) || 0;
  const newEvent = {
    name: eventData.name,
    description: eventData.description,
    category: eventData.category || 'General',
    date: eventData.date,
    time: eventData.time,
    venue: eventData.venue,
    capacity: capacityNum,
    availableSeats: capacityNum,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'events'), newEvent);
    return { id: docRef.id, ...newEvent };
  } else {
    const events = getStoredEvents();
    const created = { id: 'evt-' + Date.now(), ...newEvent };
    events.unshift(created);
    saveStoredEvents(events);
    return created;
  }
};

export const updateEvent = async (eventId, updatedData) => {
  const capacityNum = parseInt(updatedData.capacity, 10);
  
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'events', eventId);
    await updateDoc(docRef, updatedData);
    return { id: eventId, ...updatedData };
  } else {
    const events = getStoredEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      // Calculate available seats adjustment if capacity changed
      const oldEvent = events[index];
      let newAvailable = updatedData.availableSeats !== undefined ? updatedData.availableSeats : oldEvent.availableSeats;
      if (updatedData.capacity !== undefined && updatedData.capacity !== oldEvent.capacity) {
        const capacityDiff = capacityNum - oldEvent.capacity;
        newAvailable = Math.max(0, oldEvent.availableSeats + capacityDiff);
      }

      events[index] = {
        ...events[index],
        ...updatedData,
        capacity: capacityNum !== undefined ? capacityNum : events[index].capacity,
        availableSeats: newAvailable
      };
      saveStoredEvents(events);
      return events[index];
    }
    throw new Error("Event not found");
  }
};

export const deleteEvent = async (eventId) => {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'events', eventId));
  } else {
    const events = getStoredEvents();
    const filtered = events.filter(e => e.id !== eventId);
    saveStoredEvents(filtered);
  }
};

export const resetSampleData = async () => {
  if (isFirebaseConfigured && db) {
    // Delete existing events in Firestore and reseed
    const querySnapshot = await getDocs(collection(db, 'events'));
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, 'events', docSnap.id));
    }
    return await seedInitialEventsInFirestore();
  } else {
    return resetToDefaultSeedData();
  }
};
