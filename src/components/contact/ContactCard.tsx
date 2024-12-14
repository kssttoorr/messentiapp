import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Trash2, Edit2, UserCircle2, Calendar } from 'lucide-react-native';
import { Contact } from '../../types/Contact';
import { Button } from '../ui/Button';
import { CalendarModal } from '../calendar/CalendarModal';
import { CalendarEvent } from '../../types/CalendarEvent';

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
  onEdit: (contact: Contact) => void;
  events?: CalendarEvent[];
  onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
}

export function ContactCard({
  contact,
  onDelete,
  onEdit,
  events = [],
  onAddEvent,
}: ContactCardProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const fullName = `${contact.firstName} ${contact.lastName}`;

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    onAddEvent?.(event);
    setIsCalendarOpen(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <View style={styles.leftContent}>
          {contact.avatar ? (
            <Image
              source={{ uri: contact.avatar }}
              style={styles.avatar}
            />
          ) : (
            <UserCircle2 size={32} color="#9ca3af" />
          )}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{fullName}</Text>
            <Text style={styles.email} numberOfLines={1}>{contact.email}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            onPress={() => setIsCalendarOpen(true)}
            icon={Calendar}
            title=""
            variant="secondary"
          />
          <Button
            onPress={() => onEdit(contact)}
            icon={Edit2}
            title=""
            variant="secondary"
          />
          <Button
            onPress={() => onDelete(contact.id)}
            icon={Trash2}
            title=""
            variant="danger"
          />
        </View>
      </View>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        contactId={contact.id}
        events={events.filter(event => event.contactId === contact.id)}
        onAddEvent={handleAddEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginVertical: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  email: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
});
