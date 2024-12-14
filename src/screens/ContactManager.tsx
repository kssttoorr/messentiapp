import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { ContactList } from '@/components/ContactList';
import { AddContactModal } from '@/components/AddContactModal';
import { Contact } from '@/types/Contact';
import { useContacts } from '@/hooks/useContacts';

export default function ContactManager() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { contacts, addContact, updateContact, deleteContact } = useContacts();

  return (
    <SafeAreaView style={styles.container}>
      <Header onAddPress={() => setShowAddModal(true)} />
      <ContactList
        contacts={contacts}
        onEdit={setEditingContact}
        onDelete={deleteContact}
      />

      <AddContactModal
        visible={showAddModal || !!editingContact}
        onClose={() => {
          setShowAddModal(false);
          setEditingContact(null);
        }}
        onSubmit={(contactData) => {
          if (editingContact) {
            updateContact(editingContact.id, contactData);
            setEditingContact(null);
          } else {
            addContact(contactData);
            setShowAddModal(false);
          }
        }}
        contact={editingContact}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});