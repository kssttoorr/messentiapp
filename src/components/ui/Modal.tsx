import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal as RNModal, Platform, Dimensions } from 'react-native';
import { X } from 'lucide-react-native';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg';
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function Modal({ title, isOpen, onClose, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const modalWidth = size === 'lg' ? windowWidth * 0.95 : windowWidth * 0.85;

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[
          styles.container, 
          { width: modalWidth },
          Platform.OS === 'ios' && styles.iosContainer
        ]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View style={[
            styles.content,
            Platform.OS === 'ios' && styles.iosContent
          ]}>
            {children}
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxHeight: windowHeight * 0.9,
    width: '95%',
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  iosContainer: {
    height: windowHeight * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  iosContent: {
    height: '100%',
  },
});
