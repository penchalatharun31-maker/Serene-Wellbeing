import React, { useEffect, useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';

interface TimeSlotPickerProps {
  expertId: string;
  selectedDate: string;
  duration: number;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  expertId,
  selectedDate,
  duration,
  onTimeSelect,
  selectedTime,
}) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(
        `${API_BASE_URL}/experts/${expertId}/availability?date=${selectedDate}&duration=${duration}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch available time slots');
      }

      const data = await response.json();
      setAvailableSlots(data.availableSlots || []);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load available time slots. Please try again.');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [expertId, selectedDate, duration]);

  const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const groupSlotsByPeriod = () => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];

    availableSlots.forEach((slot) => {
      const [hours] = slot.split(':').map(Number);
      if (hours < 12) {
        morning.push(slot);
      } else if (hours < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={fetchAvailableSlots}
          className="text-emerald-600 text-sm font-medium hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
        <Clock className="mx-auto text-gray-400 mb-3" size={32} />
        <p className="text-gray-600 font-medium">No available slots</p>
        <p className="text-gray-500 text-sm mt-1">Please select a different date</p>
      </div>
    );
  }

  const { morning, afternoon, evening } = groupSlotsByPeriod();

  const SlotGroup = ({ title, slots }: { title: string; slots: string[] }) => {
    if (slots.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {title}
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <button
                key={slot}
                onClick={() => onTimeSelect(slot)}
                className={`
                  py-2.5 px-3 rounded-lg text-sm font-medium transition-all
                  ${
                    isSelected
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2'
                      : 'border border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
                  }
                `}
              >
                {formatTime(slot)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          Available Times ({availableSlots.length} slots)
        </h3>
        <span className="text-xs text-gray-500">
          {duration === 30 ? '30 min' : duration === 60 ? '1 hour' : `${duration} min`} session
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto pr-2">
        <SlotGroup title="Morning" slots={morning} />
        <SlotGroup title="Afternoon" slots={afternoon} />
        <SlotGroup title="Evening" slots={evening} />
      </div>
    </div>
  );
};
