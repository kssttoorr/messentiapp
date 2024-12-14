import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { Button } from './ui/Button';

interface HeaderProps {
  onAddPress: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ 
  onAddPress, 
  searchQuery, 
  onSearchChange,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search contacts..."
          placeholderTextColor="#9ca3af"
        />
      </View>
      <View style={styles.actions}>
        <Button 
          title="Add Contact" 
          onPress={onAddPress} 
          icon={UserPlus}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});
