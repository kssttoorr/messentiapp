import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Modal } from '../ui/Modal';
import { CalendarView } from './CalendarView';
import { CalendarEventForm } from './CalendarEventForm';
import { CalendarEvent } from '../../types/CalendarEvent';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

const windowHeight = Dimensions.get('window').height;

export function CalendarModal({ 
  isOpen, 
  onClose, 
  contactId, 
  events,
  onAddEvent 
}: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    onAddEvent(event);
    setIsAddingEvent(false);
    setSelectedTime(null);
  };

  const handleClose = () => {
    setIsAddingEvent(false);
    setSelectedTime(null);
    onClose();
  };

  const handleTimeSlotClick = (date: Date) => {
    setSelectedTime(date);
    setIsAddingEvent(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isAddingEvent}
        onClose={handleClose}
        title="Calendar"
        size="lg"
      >
        <View style={styles.container}>
          <View style={styles.calendarContainer}>
            <CalendarView
              events={events}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onTimeSlotClick={handleTimeSlotClick}
              onEventClick={(event) => {
                // Handle event click if needed
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal
        isOpen={isOpen && isAddingEvent}
        onClose={() => {
          setIsAddingEvent(false);
          setSelectedTime(null);
        }}
        title="Add Event"
        size="md"
      >
        <View style={styles.formContainer}>
          <CalendarEventForm
            contactId={contactId}
            onSubmit={handleAddEvent}
            onCancel={() => {
              setIsAddingEvent(false);
              setSelectedTime(null);
            }}
            initialTime={selectedTime}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: windowHeight * 0.8,
    width: '100%',
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxHeight: windowHeight * 0.7,
  },
});
