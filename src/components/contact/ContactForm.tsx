import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, Dimensions } from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Contact } from '../../types/Contact';

interface ContactFormProps {
  onSubmit: (contact: Omit<Contact, 'id' | 'favorite'>) => void;
  initialData?: Partial<Contact>;
  submitLabel?: string;
  onCancel?: () => void;
}

export function ContactForm({ 
  onSubmit, 
  initialData = {}, 
  submitLabel = 'Add Contact',
  onCancel 
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    avatar: initialData.avatar || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  const screenHeight = Dimensions.get('window').height;
  const buttonHeight = 80; // Height of button container including padding

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={[styles.scrollView, { maxHeight: screenHeight - buttonHeight }]}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => {
              setFormData({ ...formData, firstName: text });
              if (errors.firstName) {
                setErrors({ ...errors, firstName: '' });
              }
            }}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => {
              setFormData({ ...formData, lastName: text });
              if (errors.lastName) {
                setErrors({ ...errors, lastName: '' });
              }
            }}
            error={errors.lastName}
          />
          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              if (errors.email) {
                setErrors({ ...errors, email: '' });
              }
            }}
            keyboardType="email-address"
            error={errors.email}
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => {
              setFormData({ ...formData, phone: text });
              if (errors.phone) {
                setErrors({ ...errors, phone: '' });
              }
            }}
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <Input
            label="Avatar URL (optional)"
            value={formData.avatar}
            onChangeText={(text) => setFormData({ ...formData, avatar: text })}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        {onCancel && (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="secondary"
          />
        )}
        <Button
          title={submitLabel}
          onPress={handleSubmit}
          variant="primary"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 32, // Extra padding at bottom to ensure content is visible
  },
  form: {
    padding: 16,
    gap: 16,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
