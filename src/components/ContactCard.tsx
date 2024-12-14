import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Contact } from '../types/Contact';
import { Button } from './ui/Button';

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.firstName} {contact.lastName}</Text>
        <Text style={styles.detail}>{contact.email}</Text>
        <Text style={styles.detail}>{contact.phone}</Text>
      </View>
      <View style={styles.actions}>
        <Button
          title="Edit"
          onPress={onEdit}
          variant="secondary"
          icon={Pencil}
        />
        <Button
          title="Delete"
          onPress={onDelete}
          variant="danger"
          icon={Trash2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});