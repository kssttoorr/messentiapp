import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: LucideIcon;
}

export function Button({ onPress, title, variant = 'primary', icon: Icon }: ButtonProps) {
  const buttonStyle = variant === 'primary' ? styles.primaryButton : 
                     variant === 'danger' ? styles.dangerButton : 
                     styles.secondaryButton;
                     
  const textStyle = variant === 'secondary' ? styles.secondaryText : styles.buttonText;

  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      {Icon && <Icon size={20} color={variant === 'secondary' ? '#1f2937' : '#ffffff'} />}
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dangerButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
});