/**
 * Availability Helper Utilities
 * Calculates available time slots for expert bookings
 */

interface TimeSlot {
  start: string;
  end: string;
}

interface BreakTime {
  start: string;
  end: string;
  days: number[];
}

/**
 * Convert time string to minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes to time string (HH:MM)
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Add minutes to a time string
 */
export const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  const totalMinutes = timeToMinutes(time) + minutesToAdd;
  return minutesToTime(totalMinutes);
};

/**
 * Check if a time slot overlaps with any booked slots
 */
const isSlotBooked = (
  slotStart: string,
  slotEnd: string,
  bookedSlots: Array<{ startTime: string; endTime: string }>
): boolean => {
  const slotStartMinutes = timeToMinutes(slotStart);
  const slotEndMinutes = timeToMinutes(slotEnd);

  return bookedSlots.some((booked) => {
    const bookedStartMinutes = timeToMinutes(booked.startTime);
    const bookedEndMinutes = timeToMinutes(booked.endTime);

    // Check if slots overlap
    return slotStartMinutes < bookedEndMinutes && slotEndMinutes > bookedStartMinutes;
  });
};

/**
 * Check if time is during a break period
 */
const isDuringBreak = (
  time: string,
  dayOfWeek: number,
  breakTimes: BreakTime[]
): boolean => {
  const timeMinutes = timeToMinutes(time);

  return breakTimes.some((breakTime) => {
    // Check if this break applies to the current day
    if (!breakTime.days.includes(dayOfWeek)) return false;

    const breakStart = timeToMinutes(breakTime.start);
    const breakEnd = timeToMinutes(breakTime.end);

    return timeMinutes >= breakStart && timeMinutes < breakEnd;
  });
};

/**
 * Generate available time slots for a specific day
 */
export const generateAvailableSlots = (
  dayAvailability: TimeSlot[],
  slotDuration: number,
  bookedSlots: Array<{ startTime: string; endTime: string }>,
  breakTimes: BreakTime[],
  dayOfWeek: number,
  targetDate: Date
): string[] => {
  const availableSlots: string[] = [];
  const now = new Date();

  // Don't allow booking in the past
  const isToday =
    targetDate.getFullYear() === now.getFullYear() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getDate() === now.getDate();

  // Process each availability window
  dayAvailability.forEach(({ start, end }) => {
    let currentTime = timeToMinutes(start);
    const endTime = timeToMinutes(end);

    while (currentTime + slotDuration <= endTime) {
      const slotStart = minutesToTime(currentTime);
      const slotEnd = minutesToTime(currentTime + slotDuration);

      // Skip if slot is in the past (for today)
      if (isToday) {
        const slotStartDate = new Date(targetDate);
        const [hours, minutes] = slotStart.split(':').map(Number);
        slotStartDate.setHours(hours, minutes, 0, 0);

        if (slotStartDate <= now) {
          currentTime += slotDuration;
          continue;
        }
      }

      // Check if slot is not booked and not during break
      if (
        !isSlotBooked(slotStart, slotEnd, bookedSlots) &&
        !isDuringBreak(slotStart, dayOfWeek, breakTimes)
      ) {
        availableSlots.push(slotStart);
      }

      currentTime += slotDuration;
    }
  });

  return availableSlots;
};

/**
 * Check if a date has any available slots
 */
export const hasAvailableSlots = (
  date: Date,
  dayAvailability: TimeSlot[],
  slotDuration: number,
  bookedSlots: Array<{ startTime: string; endTime: string }>,
  breakTimes: BreakTime[]
): boolean => {
  const slots = generateAvailableSlots(
    dayAvailability,
    slotDuration,
    bookedSlots,
    breakTimes,
    date.getDay(),
    date
  );
  return slots.length > 0;
};

/**
 * Get available dates in a month
 */
export const getAvailableDatesInMonth = (
  year: number,
  month: number,
  weeklyAvailability: {
    sunday: TimeSlot[];
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
  },
  slotDuration: number,
  bookedSlotsByDate: Map<string, Array<{ startTime: string; endTime: string }>>,
  breakTimes: BreakTime[]
): string[] => {
  const availableDates: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    // Skip past dates
    if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      continue;
    }

    const dayOfWeek = date.getDay();
    const dayName = dayNames[dayOfWeek] as keyof typeof weeklyAvailability;
    const dayAvailability = weeklyAvailability[dayName] || [];

    // Skip if no availability set for this day
    if (dayAvailability.length === 0) {
      continue;
    }

    // Get booked slots for this date
    const dateStr = date.toISOString().split('T')[0];
    const bookedSlots = bookedSlotsByDate.get(dateStr) || [];

    // Check if day has available slots
    if (hasAvailableSlots(date, dayAvailability, slotDuration, bookedSlots, breakTimes)) {
      availableDates.push(dateStr);
    }
  }

  return availableDates;
};
