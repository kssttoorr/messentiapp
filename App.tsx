import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import ContactManager from './src/screens/ContactManager';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ContactManager />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
