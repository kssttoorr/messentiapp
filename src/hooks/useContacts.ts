import { useState, useEffect } from 'react';
import { 
  database,
  ref,
  set,
  get,
  remove,
  update,
  onValue,
  query,
  orderByChild
} from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Contact } from '../types/Contact';
import { CalendarEvent } from '../types/CalendarEvent';
import { push, child, off, DataSnapshot } from 'firebase/database';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Set up contacts listener
    const contactsRef = ref(database, `users/${user.uid}/contacts`);
    const eventsRef = ref(database, `users/${user.uid}/events`);

    const unsubscribeContacts = onValue(contactsRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const contactsList = Object.entries(data).map(([id, contact]) => ({
          id,
          ...(contact as Omit<Contact, 'id'>),
        }));
        setContacts(contactsList);
      } else {
        setContacts([]);
      }
    });

    const unsubscribeEvents = onValue(eventsRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsList = Object.entries(data).map(([id, event]) => ({
          id,
          ...(event as Omit<CalendarEvent, 'id'>),
        }));
        setEvents(eventsList);
      } else {
        setEvents([]);
      }
    });

    // Cleanup listeners
    return () => {
      unsubscribeContacts();
      unsubscribeEvents();
    };
  }, [user]);

  const addContact = async (contactData: Omit<Contact, 'id' | 'favorite'>) => {
    if (!user) throw new Error('User must be authenticated');

    const newContact: Omit<Contact, 'id'> = {
      ...contactData,
      favorite: false,
    };

    const contactsRef = ref(database, `users/${user.uid}/contacts`);
    const newContactRef = push(contactsRef);
    await set(newContactRef, newContact);
    return newContactRef.key as string;
  };

  const updateContact = async (id: string, contactData: Omit<Contact, 'id'>) => {
    if (!user) throw new Error('User must be authenticated');

    const contactRef = ref(database, `users/${user.uid}/contacts/${id}`);
    await update(contactRef, contactData);
  };

  const deleteContact = async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    // Delete contact
    const contactRef = ref(database, `users/${user.uid}/contacts/${id}`);
    await remove(contactRef);

    // Delete associated events
    const eventsRef = ref(database, `users/${user.uid}/events`);
    const eventsQuery = query(eventsRef, orderByChild('contactId'));
    const snapshot = await get(eventsQuery);
    
    const updates: Record<string, null> = {};
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().contactId === id) {
        updates[childSnapshot.key as string] = null;
      }
      return true; // Required by Firebase's forEach
    });

    if (Object.keys(updates).length > 0) {
      await update(eventsRef, updates);
    }
  };

  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (!user) throw new Error('User must be authenticated');

    const eventsRef = ref(database, `users/${user.uid}/events`);
    const newEventRef = push(eventsRef);
    await set(newEventRef, eventData);
    return newEventRef.key as string;
  };

  const deleteEvent = async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    const eventRef = ref(database, `users/${user.uid}/events/${id}`);
    await remove(eventRef);
  };

  return {
    contacts,
    events,
    addContact,
    updateContact,
    deleteContact,
    addEvent,
    deleteEvent,
  };
}
