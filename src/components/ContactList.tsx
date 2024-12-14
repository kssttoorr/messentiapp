import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Contact } from '../types/Contact';
import { CalendarEvent } from '../types/CalendarEvent';
import { ContactCard } from './contact/ContactCard';

interface ContactListProps {
  contacts: Contact[];
  events: CalendarEvent[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

export function ContactList({ 
  contacts, 
  events,
  onEdit, 
  onDelete,
  onAddEvent
}: ContactListProps) {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ContactCard
          contact={item}
          events={events}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
          onAddEvent={onAddEvent}
        />
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts yet</Text>
          <Text style={styles.emptySubtext}>Add your first contact using the button above</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
