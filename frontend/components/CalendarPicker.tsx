import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface CalendarPickerProps {
  expertId: string;
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
  duration: number;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  expertId,
  onDateSelect,
  selectedDate,
  duration,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableDates = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1; // JavaScript months are 0-indexed

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${API_BASE_URL}/api/v1/experts/${expertId}/available-dates?year=${year}&month=${month}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch available dates');
      }

      const data = await response.json();
      setAvailableDates(data.availableDates || []);
    } catch (error) {
      console.error('Error fetching available dates:', error);
      setAvailableDates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableDates();
  }, [expertId, currentMonth, duration]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDate = (day: number): string => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isDateAvailable = (day: number): boolean => {
    const dateStr = formatDate(day);
    return availableDates.includes(dateStr);
  };

  const isDatePast = (day: number): boolean => {
    const dateStr = formatDate(day);
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isPreviousMonthDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          disabled={isPreviousMonthDisabled}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            isPreviousMonthDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateStr = formatDate(day);
            const isAvailable = isDateAvailable(day);
            const isPast = isDatePast(day);
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={day}
                onClick={() => isAvailable && !isPast && onDateSelect(dateStr)}
                disabled={!isAvailable || isPast}
                className={`
                  aspect-square rounded-lg text-sm font-medium transition-all
                  ${
                    isSelected
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2'
                      : isAvailable && !isPast
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : isPast
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-50 border border-emerald-200"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border border-gray-200"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};
