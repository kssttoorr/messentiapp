import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ContactManager from './src/screens/ContactManager';

export default function App() {
  return (
    <SafeAreaProvider>
      <ContactManager />
    </SafeAreaProvider>
  );
}