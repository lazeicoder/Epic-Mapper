import React, { useMemo, useState } from 'react';
import { Range } from 'react-range';
import { useAppStore } from '../store/useAppStore';

const TOTAL_HOURS = 30 * 24; // 30 days
const STEP = 1;

const TimelineSlider: React.FC = () => {
  const { setTimeRange } = useAppStore();

  const now = useMemo(() => new Date(), []);

  const [range, setRange] = useState<number[]>([0, TOTAL_HOURS]);

  // Convert hour offsets into actual timestamps
  const start = new Date(now.getTime() + (range[0] - TOTAL_HOURS / 2) * 3600 * 1000);
  const end = new Date(now.getTime() + (range[1] - TOTAL_HOURS / 2) * 3600 * 1000);

  const handleChange = (values: number[]) => {
    setRange(values);
    const [startHour, endHour] = values;
    const newStart = new Date(now.getTime() + (startHour - TOTAL_HOURS / 2) * 3600 * 1000);
    const newEnd = new Date(now.getTime() + (endHour - TOTAL_HOURS / 2) * 3600 * 1000);
    setTimeRange({ start: newStart, end: newEnd });
  };

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      <div className="flex justify-between mb-2 text-sm font-mono">
        <span>Start: {start.toLocaleString()}</span>
        <span>End: {end.toLocaleString()}</span>
      </div>

      <Range
        step={STEP}
        min={0}
        max={TOTAL_HOURS}
        values={range}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '6px',
              width: '100%',
              backgroundColor: '#ccc',
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '20px',
              width: '20px',
              backgroundColor: '#ff7f50',
              borderRadius: '50%',
              boxShadow: '0 0 0 2px white',
            }}
          />
        )}
      />
    </div>
  );
};

export default TimelineSlider;
