import React, { useState } from 'react';

export interface ChartPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

interface MonkeytypeChartProps {
  data: ChartPoint[];
  maxWpm: number;
}

export const MonkeytypeChart: React.FC<MonkeytypeChartProps> = ({ data, maxWpm }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length < 2) {
    return (
      <div className="w-full h-44 flex items-center justify-center text-slate-400 font-mono text-xs">
        Not enough time elapsed to generate performance curve
      </div>
    );
  }

  const width = 760;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 25, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(maxWpm + 10, ...data.map((d) => Math.max(d.wpm, d.rawWpm)), 30);
  const minVal = 0;
  const maxSec = Math.max(data[data.length - 1].second, 1);

  const getX = (sec: number) => padding.left + (sec / maxSec) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  // Build SVG path strings
  const wpmPoints = data.map((d) => `${getX(d.second)},${getY(d.wpm)}`).join(' ');
  const rawPoints = data.map((d) => `${getX(d.second)},${getY(d.rawWpm)}`).join(' ');

  // Grid lines
  const yTicks = [0, Math.round(maxVal / 2), Math.round(maxVal)];
  const xTicks = [
    0,
    Math.round(maxSec * 0.25),
    Math.round(maxSec * 0.5),
    Math.round(maxSec * 0.75),
    maxSec
  ];

  return (
    <div className="w-full relative select-none font-mono">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="ciisWpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#db2777" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#db2777" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={`y-${tick}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="end"
                className="font-mono"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Vertical Grid Lines & X Labels */}
        {xTicks.map((sec) => {
          const x = getX(sec);
          return (
            <g key={`x-${sec}`}>
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={height - padding.bottom}
                stroke="#1e293b"
                strokeWidth="1"
              />
              <text
                x={x}
                y={height - 6}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="middle"
                className="font-mono"
              >
                {sec}s
              </text>
            </g>
          );
        })}

        {/* WPM Area Fill with CIIS Pink Gradient */}
        <polygon
          points={`${padding.left},${getY(0)} ${wpmPoints} ${getX(maxSec)},${getY(0)}`}
          fill="url(#ciisWpmGradient)"
        />

        {/* Raw WPM Line (Dashed Slate) */}
        <polyline
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="3 3"
          points={rawPoints}
        />

        {/* Net WPM Line (Solid CIIS Brand Pink) */}
        <polyline
          fill="none"
          stroke="#db2777"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={wpmPoints}
        />

        {/* Data Point Dots and Error Markers */}
        {data.map((d, i) => {
          const cx = getX(d.second);
          const cy = getY(d.wpm);
          const hasError = d.errors > 0;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            >
              {/* Invisible touch/hover target */}
              <rect
                x={cx - 10}
                y={padding.top}
                width={20}
                height={chartHeight}
                fill="transparent"
              />

              {/* Pink Dot for WPM */}
              <circle
                cx={cx}
                cy={cy}
                r={hoverIndex === i ? 5 : 2.5}
                fill="#db2777"
                stroke="#0f172a"
                strokeWidth={hoverIndex === i ? 2 : 1}
              />

              {/* Red Error Marker if error occurred during this second */}
              {hasError && (
                <g transform={`translate(${cx}, ${height - padding.bottom + 12})`}>
                  <circle cx="0" cy="0" r="3" fill="#f43f5e" />
                  <text
                    x="0"
                    y="2"
                    fill="#ffffff"
                    fontSize="7"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    ✕
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Active Hover Vertical Line & Tooltip */}
        {hoverIndex !== null && data[hoverIndex] && (
          <g>
            <line
              x1={getX(data[hoverIndex].second)}
              y1={padding.top}
              x2={getX(data[hoverIndex].second)}
              y2={height - padding.bottom}
              stroke="#db2777"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </g>
        )}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoverIndex !== null && data[hoverIndex] && (
        <div
          className="absolute pointer-events-none bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-pink-900/50 shadow-xl text-xs flex items-center gap-3 transform -translate-x-1/2 -translate-y-full top-2 transition-all z-20 font-mono"
          style={{
            left: `${(getX(data[hoverIndex].second) / width) * 100}%`
          }}
        >
          <span className="text-slate-400 font-bold">{data[hoverIndex].second}s</span>
          <span className="text-pink-400 font-black">{data[hoverIndex].wpm} wpm</span>
          <span className="text-slate-200">{data[hoverIndex].rawWpm} raw</span>
          {data[hoverIndex].errors > 0 && (
            <span className="text-rose-400 font-bold">
              {data[hoverIndex].errors} {data[hoverIndex].errors === 1 ? 'error' : 'errors'}
            </span>
          )}
        </div>
      )}

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-pink-600 rounded-full inline-block" />
          <span>wpm (net speed)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-b border-dashed border-slate-400 inline-block" />
          <span>raw wpm</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          <span>errors</span>
        </div>
      </div>
    </div>
  );
};
