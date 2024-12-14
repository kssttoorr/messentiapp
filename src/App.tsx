import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ContactList } from './components/ContactList';
import { Header } from './components/Header';
import { Modal } from './components/ui/Modal';
import { ContactForm } from './components/contact/ContactForm';
import { useContacts } from './hooks/useContacts';
import { Contact } from './types/Contact';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './screens/LoginScreen';

function AppContent() {
  const { user } = useAuth();
  const { 
    contacts, 
    events,
    addContact, 
    updateContact, 
    deleteContact,
    addEvent,
  } = useContacts();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // If user is not authenticated, show login screen
  if (!user) {
    return <LoginScreen />;
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onAddPress={() => setShowAddModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <View style={styles.content}>
        <ContactList
          contacts={filteredContacts}
          events={events}
          onEdit={setEditingContact}
          onDelete={deleteContact}
          onAddEvent={addEvent}
        />
      </View>

      <Modal
        title="Add Contact"
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      >
        <ContactForm
          onSubmit={(contact) => {
            addContact(contact);
            setShowAddModal(false);
          }}
        />
      </Modal>

      <Modal
        title="Edit Contact"
        isOpen={!!editingContact}
        onClose={() => setEditingContact(null)}
      >
        {editingContact && (
          <ContactForm
            initialData={editingContact}
            submitLabel="Save Changes"
            onSubmit={(contact) => {
              updateContact(editingContact.id, contact);
              setEditingContact(null);
            }}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
