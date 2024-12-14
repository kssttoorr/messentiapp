import { Contact } from '../types/Contact';

const STORAGE_KEY = 'contacts';

export const saveContacts = (contacts: Contact[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

export const loadContacts = (): Contact[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};