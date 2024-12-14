import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CalendarEvent } from '../../types/CalendarEvent';

interface CalendarEventFormProps {
  contactId: string;
  onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
  initialTime?: Date | null;
}

const DURATION_OPTIONS = [
  { label: '15 minutes', value: '15min' },
  { label: '30 minutes', value: '30min' },
  { label: '1 hour', value: '1hr' },
  { label: '2 hours', value: '2hr' },
  { label: 'All day', value: 'allday' },
] as const;

export function CalendarEventForm({ 
  contactId, 
  onSubmit, 
  onCancel,
  initialTime = null
}: CalendarEventFormProps) {
  const [startTime, setStartTime] = useState(initialTime || new Date());
  const [duration, setDuration] = useState<CalendarEvent['duration']>('30min');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialTime) {
      setStartTime(initialTime);
    }
  }, [initialTime]);

  const handleSubmit = () => {
    onSubmit({
      contactId,
      startTime,
      duration,
      note,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleTimeChange = (text: string) => {
    const [time, period] = text.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(startTime);
    
    let adjustedHours = hours;
    if (period?.toLowerCase() === 'pm' && hours !== 12) {
      adjustedHours += 12;
    } else if (period?.toLowerCase() === 'am' && hours === 12) {
      adjustedHours = 0;
    }
    
    newDate.setHours(adjustedHours);
    newDate.setMinutes(minutes || 0);
    setStartTime(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Start Time</Text>
        <Input
          label=""
          value={formatTime(startTime)}
          onChangeText={handleTimeChange}
          placeholder="HH:MM AM/PM"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Duration</Text>
        <View style={styles.durationContainer}>
          {DURATION_OPTIONS.map((option) => (
            <Button
              key={option.value}
              title={option.label}
              onPress={() => setDuration(option.value)}
              variant={duration === option.value ? 'primary' : 'secondary'}
            />
          ))}
        </View>
      </View>

      <Input
        label="Note"
        value={note}
        onChangeText={setNote}
        placeholder="Add a note for this event"
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="secondary"
        />
        <Button
          title="Schedule Event"
          onPress={handleSubmit}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 24,
  },
});
