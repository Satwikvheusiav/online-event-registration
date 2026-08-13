import { db, isFirebaseConfigured } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  runTransaction 
} from 'firebase/firestore';
import { 
  getStoredRegistrations, 
  saveStoredRegistrations, 
  getStoredEvents, 
  saveStoredEvents 
} from './mockStore';

export const registerForEvent = async (event, user) => {
  if (!user || !user.uid) {
    throw new Error("You must be logged in to register for an event.");
  }

  if (isFirebaseConfigured && db) {
    // Transactional Firestore registration to guarantee consistency and concurrency protection
    return await runTransaction(db, async (transaction) => {
      const eventRef = doc(db, 'events', event.id);
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists()) {
        throw new Error("Event does not exist.");
      }

      const eventData = eventDoc.data();

      // 1. Capacity Check
      if (eventData.availableSeats <= 0) {
        throw new Error("Registration Failed: This event is fully booked!");
      }

      // 2. Duplicate Registration Check
      const regQuery = query(
        collection(db, 'registrations'),
        where('eventId', '==', event.id),
        where('userId', '==', user.uid)
      );
      const existingRegs = await getDocs(regQuery);
      if (!existingRegs.empty) {
        throw new Error("You are already registered for this event.");
      }

      // 3. Create Registration Document
      const newRegRef = doc(collection(db, 'registrations'));
      const regData = {
        eventId: event.id,
        eventName: eventData.name,
        eventCategory: eventData.category,
        eventDate: eventData.date,
        eventTime: eventData.time,
        eventVenue: eventData.venue,
        userId: user.uid,
        userName: user.name || user.email,
        userEmail: user.email,
        registeredAt: new Date().toISOString()
      };

      transaction.set(newRegRef, regData);

      // 4. Decrement available seats
      transaction.update(eventRef, {
        availableSeats: eventData.availableSeats - 1
      });

      return { id: newRegRef.id, ...regData };
    });
  } else {
    // Local / Demo Store Mode
    const events = getStoredEvents();
    const targetEvent = events.find(e => e.id === event.id);

    if (!targetEvent) {
      throw new Error("Event not found.");
    }

    // 1. Capacity Check
    if (targetEvent.availableSeats <= 0) {
      throw new Error("Registration Failed: This event is fully booked!");
    }

    // 2. Duplicate Check
    const registrations = getStoredRegistrations();
    const existing = registrations.find(r => r.eventId === event.id && r.userId === user.uid);
    if (existing) {
      throw new Error("You are already registered for this event.");
    }

    // 3. Decrement seats
    targetEvent.availableSeats -= 1;
    saveStoredEvents(events);

    // 4. Store registration record
    const newRegistration = {
      id: 'reg-' + Date.now(),
      eventId: targetEvent.id,
      eventName: targetEvent.name,
      eventCategory: targetEvent.category,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time,
      eventVenue: targetEvent.venue,
      userId: user.uid,
      userName: user.name || user.email,
      userEmail: user.email,
      registeredAt: new Date().toISOString()
    };

    registrations.unshift(newRegistration);
    saveStoredRegistrations(registrations);

    return newRegistration;
  }
};

export const cancelRegistration = async (registrationId, eventId) => {
  if (isFirebaseConfigured && db) {
    return await runTransaction(db, async (transaction) => {
      const regRef = doc(db, 'registrations', registrationId);
      const regDoc = await transaction.get(regRef);

      if (regDoc.exists()) {
        const regData = regDoc.data();
        const targetEventId = eventId || regData.eventId;
        
        const eventRef = doc(db, 'events', targetEventId);
        const eventDoc = await transaction.get(eventRef);

        // Perform writes after all reads are completed
        transaction.delete(regRef);

        if (eventDoc.exists()) {
          const currentSeats = eventDoc.data().availableSeats || 0;
          const maxCapacity = eventDoc.data().capacity || 100;
          transaction.update(eventRef, {
            availableSeats: Math.min(maxCapacity, currentSeats + 1)
          });
        }
      }
    });
  } else {
    // Local / Demo store mode
    const registrations = getStoredRegistrations();
    const targetReg = registrations.find(r => r.id === registrationId);
    
    if (targetReg) {
      const targetEventId = eventId || targetReg.eventId;
      
      // Remove registration
      const updatedRegs = registrations.filter(r => r.id !== registrationId);
      saveStoredRegistrations(updatedRegs);

      // Increment seats on event
      const events = getStoredEvents();
      const targetEvent = events.find(e => e.id === targetEventId);
      if (targetEvent) {
        targetEvent.availableSeats = Math.min(targetEvent.capacity, targetEvent.availableSeats + 1);
        saveStoredEvents(events);
      }
    }
  }
};

export const getUserRegistrations = async (userId) => {
  if (!userId) return [];
  
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'registrations'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const regs = [];
      querySnapshot.forEach(docSnap => {
        regs.push({ id: docSnap.id, ...docSnap.data() });
      });
      return regs;
    } catch (e) {
      console.warn("Error fetching user registrations from Firestore", e);
      return getStoredRegistrations().filter(r => r.userId === userId);
    }
  } else {
    return getStoredRegistrations().filter(r => r.userId === userId);
  }
};

export const getAllRegistrations = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'registrations'));
      const regs = [];
      querySnapshot.forEach(docSnap => {
        regs.push({ id: docSnap.id, ...docSnap.data() });
      });
      return regs;
    } catch (e) {
      console.warn("Error fetching all registrations from Firestore", e);
      return getStoredRegistrations();
    }
  } else {
    return getStoredRegistrations();
  }
};
