export interface CalendarEvent {
  id: string;
  contactId: string;
  startTime: Date;
  duration: '15min' | '30min' | '1hr' | '2hr' | 'allday';
  note: string;
}

export type CalendarView = 'day' | '3day' | 'week' | 'month';
