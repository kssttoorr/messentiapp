import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Button } from '../ui/Button';
import { CalendarEvent, CalendarView as CalendarViewType } from '../../types/CalendarEvent';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CalendarViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotClick: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const VIEW_OPTIONS: { label: string; value: CalendarViewType }[] = [
  { label: 'Day', value: 'day' },
  { label: '3 Days', value: '3day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const windowWidth = Dimensions.get('window').width;
const TIME_COLUMN_WIDTH = 60;
const COLUMN_MIN_WIDTH = 200;

export function CalendarView({ 
  events, 
  selectedDate, 
  onDateChange, 
  onTimeSlotClick,
  onEventClick 
}: CalendarViewProps) {
  const [currentView, setCurrentView] = useState<CalendarViewType>('day');

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour} ${period}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysToShow = () => {
    const days: Date[] = [];
    const start = new Date(selectedDate);
    const daysCount = 
      currentView === 'day' ? 1 :
      currentView === '3day' ? 3 :
      currentView === 'week' ? 7 :
      35; // For month view, show 5 weeks

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    const days = direction === 'next' ? 1 : -1;
    newDate.setDate(selectedDate.getDate() + days);
    onDateChange(newDate);
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const clickedDate = new Date(day);
    clickedDate.setHours(hour, 0, 0, 0);
    onTimeSlotClick(clickedDate);
  };

  const days = getDaysToShow();
  const columnWidth = Math.max(
    COLUMN_MIN_WIDTH,
    (windowWidth - TIME_COLUMN_WIDTH) / days.length
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.viewButtons}>
          {VIEW_OPTIONS.map(option => (
            <Button
              key={option.value}
              title={option.label}
              onPress={() => setCurrentView(option.value)}
              variant={currentView === option.value ? 'primary' : 'secondary'}
            />
          ))}
        </View>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.currentDate}>{formatDate(selectedDate)}</Text>
          <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
            <ChevronRight size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.timeGridContainer}>
        <View style={styles.timeGrid}>
          {/* Time labels */}
          <View style={[styles.timeLabels, { width: TIME_COLUMN_WIDTH }]}>
            <View style={styles.dayHeader} />
            {HOURS.map(hour => (
              <View key={hour} style={styles.timeLabelContainer}>
                <Text style={styles.timeLabel} numberOfLines={1}>
                  {formatHour(hour)}
                </Text>
              </View>
            ))}
          </View>

          {/* Day columns */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScrollContent}
          >
            <View style={styles.daysContainer}>
              {days.map((day) => (
                <View key={day.toISOString()} style={[styles.dayColumn, { width: columnWidth }]}>
                  <Text style={styles.dayHeader}>{formatDate(day)}</Text>
                  {HOURS.map(hour => {
                    const dayEvents = getEventsForDay(day).filter(event => {
                      const eventHour = new Date(event.startTime).getHours();
                      return eventHour === hour;
                    });

                    return (
                      <TouchableOpacity
                        key={hour}
                        style={styles.timeSlot}
                        onPress={() => handleTimeSlotClick(day, hour)}
                      >
                        {dayEvents.map(event => (
                          <TouchableOpacity 
                            key={event.id} 
                            style={styles.eventCard}
                            onPress={(e) => {
                              e.stopPropagation();
                              onEventClick?.(event);
                            }}
                          >
                            <Text style={styles.eventTime} numberOfLines={1}>
                              {new Date(event.startTime).toLocaleTimeString([], { 
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </Text>
                            <Text style={styles.eventNote} numberOfLines={2}>{event.note}</Text>
                          </TouchableOpacity>
                        ))}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        zIndex: 1,
      },
    }),
  },
  viewButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  navButton: {
    padding: 8,
  },
  currentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timeGridContainer: {
    flex: 1,
    ...Platform.select({
      ios: {
        zIndex: 0,
      },
    }),
  },
  timeGrid: {
    flexDirection: 'row',
    flex: 1,
  },
  timeLabels: {
    backgroundColor: '#f9fafb',
  },
  timeLabelContainer: {
    height: 60,
    justifyContent: 'center',
    paddingRight: 8,
  },
  timeLabel: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'right',
  },
  daysScrollContent: {
    flexGrow: 1,
  },
  daysContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  dayColumn: {
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  dayHeader: {
    height: 40,
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  timeSlot: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 2,
  },
  eventCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    padding: 4,
    margin: 2,
  },
  eventTime: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  eventNote: {
    color: '#ffffff',
    fontSize: 12,
  },
});
