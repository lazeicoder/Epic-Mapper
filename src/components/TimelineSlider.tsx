import React, { useEffect, useState } from 'react'
import { addHours, format, startOfHour } from 'date-fns'

type Props = {
  range: [number, number]
  setRange: (range: [number, number]) => void
}

const TimelineSlider: React.FC<Props> = ({ range, setRange }) => {
  const baseTime = startOfHour(new Date())
  const totalHours = 720

  const [realHourOffset, setRealHourOffset] = useState(0)
  const [activeThumb, setActiveThumb] = useState<'start' | 'end' | null>(null)

  useEffect(() => {
    const updateOffset = () => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - baseTime.getTime()) / 3600000)
      setRealHourOffset(diff)
    }

    updateOffset()
    const interval = setInterval(updateOffset, 60000)
    return () => clearInterval(interval)
  }, [baseTime])

  const getHourOffsetDate = (offset: number) => addHours(baseTime, offset)

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (val <= range[1]) setRange([val, range[1]])
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (val >= range[0]) setRange([range[0], val])
  }

  const leftPercent = ((range[0] + 360) / (totalHours - 1)) * 100
  const widthPercent = ((range[1] - range[0]) / (totalHours - 1)) * 100

  return (
    <div style={{ padding: '16px' }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
        Selected Range:{' '}
        <span
          style={{ color: '#3b82f6', cursor: 'pointer' }}
          onClick={() => setActiveThumb('start')}
        >
          {format(getHourOffsetDate(range[0]), 'MMM d, HH:00')}
        </span>{' '}
        –{' '}
        <span
          style={{ color: '#f97316', cursor: 'pointer' }}
          onClick={() => setActiveThumb('end')}
        >
          {format(getHourOffsetDate(range[1]), 'MMM d, HH:00')}
        </span>
      </label>

      <div style={{ position: 'relative', height: '40px' }}>
        {/* Base track */}
        <div
          style={{
            position: 'absolute',
            height: '6px',
            background: '#e5e7eb',
            width: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            borderRadius: '3px',
            zIndex: 0,
          }}
        />

        {/* Selected range highlight */}
        <div
          style={{
            position: 'absolute',
            height: '6px',
            background: 'rgba(76, 105, 138, 0.5)',
            top: '50%',
            transform: 'translateY(-50%)',
            borderRadius: '3px',
            zIndex: 1,
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />

        {/* Start thumb */}
        <input
          type="range"
          min={-360}
          max={359}
          value={range[0]}
          onChange={handleStartChange}
          onMouseDown={() => setActiveThumb('start')}
          className="slider-blue"
        />

        {/* End thumb */}
        <input
          type="range"
          min={-360}
          max={359}
          value={range[1]}
          onChange={handleEndChange}
          onMouseDown={() => setActiveThumb('end')}
          className="slider-orange"
        />
      </div>

      {/* Tick labels */}
      <div style={{ position: 'relative', marginTop: '12px', height: '20px' }}>
        {Array.from({ length: totalHours }, (_, i) => {
          const offset = i - 360
          const date = getHourOffsetDate(offset)
          if (offset % 48 !== 0) return null

          return (
            <span
              key={offset}
              style={{
                position: 'absolute',
                left: `${(i / (totalHours - 1)) * 100}%`,
                transform: 'translateX(-50%)',
                fontSize: '10px',
                fontWeight: offset === realHourOffset ? 'bold' : 'normal',
                color: offset === realHourOffset ? '#b39a36' : '#666',
              }}
            >
              {format(date, 'MMM d')}
            </span>
          )
        })}
      </div>

      {/* CSS for thumbs only clickable */}
      <style>
        {`
          input[type='range'] {
            position: absolute;
            width: 100%;
            height: 40px;
            background: transparent;
            pointer-events: none; /* disable clicking on track */
            -webkit-appearance: none;
            z-index: 2;
          }

          input[type='range']::-webkit-slider-runnable-track {
            background: transparent;
            height: 6px;
          }

          input[type='range']::-moz-range-track {
            background: transparent;
            height: 6px;
          }

          .slider-blue::-webkit-slider-thumb {
            -webkit-appearance: none;
            pointer-events: auto;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            margin-top: -4px;
          }

          .slider-orange::-webkit-slider-thumb {
            -webkit-appearance: none;
            pointer-events: auto;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
            margin-top: -4px;
          }

          .slider-blue::-moz-range-thumb {
            pointer-events: auto;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
          }

          .slider-orange::-moz-range-thumb {
            pointer-events: auto;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  )
}

export default TimelineSlider
