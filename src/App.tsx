import './index.css';
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';


// ─── Data ─────────────────────────────────────────────────────────────────────

function buildChartData() {
  const noise = [2, -3, 4, -2, 5, -4, 3, 1, -5, 4, -1, 3, -4, 6, -2, 3, -3, 2, 4, -3, 5, -1, 3, -2, 2];
  const base = 150;
  const points = noise.map((n, i) => {
    const d = new Date(2026, 3, 29, 23, 20 + Math.floor(i * 0.48));
    return {
      time: `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`,
      pm25: base + n,
    };
  });
  [156, 165, 175, 184, 190].forEach((v, i) => {
    const d = new Date(2026, 3, 29, 23, 32 + i * 4);
    points.push({ time: `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`, pm25: v });
  });
  return points;
}
const chartData = buildChartData();

const SPIKE_COLOR = '#6E1A37';

const historyLog = [
  { id: 1, time: 'Today · 23:50',      source: 'Heavy traffic / construction dust', delta: 40, level: 'Hazardous',     color: SPIKE_COLOR },
  { id: 2, time: 'Today · 20:12',      source: 'Evening vehicle emissions',          delta: 28, level: 'Very Unhealthy', color: SPIKE_COLOR },
  { id: 3, time: 'Today · 16:45',      source: 'Burning waste / biomass',            delta: 35, level: 'Hazardous',     color: SPIKE_COLOR },
  { id: 4, time: 'Today · 11:23',      source: 'Industrial emissions (upwind)',       delta: 22, level: 'Very Unhealthy', color: SPIKE_COLOR },
  { id: 5, time: 'Yesterday · 19:04',  source: 'Diesel generator cluster',            delta: 31, level: 'Hazardous',     color: SPIKE_COLOR },
];

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value as number;
  const isSpike = val > 165;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs shadow-lg border"
      style={{
        background: 'white',
        borderColor: isSpike ? '#6E1A37' : '#bae6fd',
      }}
    >
      <p className="text-slate-400 mb-0.5 font-medium">{label}</p>
      <p className="font-bold" style={{ color: isSpike ? '#6E1A37' : '#0ea5e9' }}>
        PM2.5 — {val} µg/m³
      </p>
      {isSpike && <p className="text-[10px] mt-0.5 font-semibold" style={{ color: '#6E1A37' }}>⚡ Above baseline</p>}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="flex items-center justify-between px-5 pt-12 pb-4">
      <div>
        <h1
          className="text-2xl font-extrabold tracking-tight text-sky-900 leading-none"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          AeroContext
        </h1>
        <p className="text-xs text-sky-400 mt-0.5 font-semibold tracking-widest uppercase">
          Dhaka, Bangladesh
        </p>
      </div>

      {/* BLE pill */}
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
        <span className="relative flex items-center justify-center w-2.5 h-2.5">
          <span className="ble-ring absolute inset-0 rounded-full bg-emerald-400" />
          <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-emerald-600 text-xs font-semibold">BLE Connected</span>
      </div>
    </header>
  );
}

// ─── Current Reading ──────────────────────────────────────────────────────────

function CurrentReading() {
  const [count, setCount] = useState(150);
  useEffect(() => {
    const start = 150, end = 190, dur = 1100;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setCount(Math.round(start + (end - start) * (1 - (1 - p) ** 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <section className="px-4 pb-3">
      {/* Main card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100">

        {/* Top row */}
        <div className="flex items-start justify-between mb-1">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
            Current PM2.5
          </p>
          <span className="text-[10px] font-bold tracking-widest rounded-full px-2.5 py-0.5" style={{ color: '#6E1A37', background: '#6E1A3710', border: '1px solid #6E1A3730' }}>
            SPIKE ⚡
          </span>
        </div>

        {/* Value */}
        <div className="flex items-end gap-2 mt-1 mb-3">
          <span
            className="text-8xl font-black leading-none tabular-nums amber-pulse count-in"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#6E1A37' }}
          >
            {count}
          </span>
          <span className="text-base font-semibold text-slate-400 mb-3">µg/m³</span>
        </div>

        {/* Delta note */}
        <div className="flex items-center gap-1.5 mb-4">
          <svg width="11" height="11" viewBox="0 0 11 11"><path d="M5.5 1.5L9.5 9H1.5L5.5 1.5Z" fill="#6E1A37"/></svg>
          <span className="text-xs font-semibold" style={{ color: '#6E1A37' }}>
            +40 µg/m³ above dynamic baseline (150)
          </span>
        </div>

        {/* AQI colour bar */}
        <div>
          <div
            className="h-2.5 rounded-full w-full"
            style={{ background: 'linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444, #a855f7)' }}
          />
          {/* Marker */}
          <div className="relative h-0">
            <div
              className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow -top-[22px]"
              style={{ left: 'calc(76% - 7px)', background: '#6E1A37', boxShadow: '0 0 0 3px #6E1A3730, 0 2px 6px #6E1A3750' }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-medium mt-2.5">
            <span>Good</span><span>Moderate</span><span>Unhealthy</span><span>Hazardous</span>
          </div>
        </div>

        {/* AQI badge row */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="flex-1 text-center">
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">AQI (US)</p>
            <p className="text-lg font-black" style={{ color: '#6E1A37', fontFamily: "'Space Grotesk', sans-serif" }}>248</p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="flex-1 text-center">
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">Category</p>
            <p className="text-xs font-bold" style={{ color: '#6E1A37' }}>Very Unhealthy</p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="flex-1 text-center">
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">Updated</p>
            <p className="text-xs font-bold text-slate-600">23:50</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Ambient Conditions ────────────────────────────────────────────────────────

function ConditionsRow() {
  const stats = [
    { emoji: '💨', label: 'Wind',       value: '3.2', unit: 'km/h' },
    { emoji: '💧', label: 'Humidity',   value: '78',  unit: '%'    },
    { emoji: '🌡️', label: 'Temp',       value: '29',  unit: '°C'   },
    { emoji: '👁️', label: 'Visibility', value: '1.1', unit: 'km'   },
  ];
  return (
    <section className="px-4 pb-3">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow-sm border border-sky-100 flex flex-col items-center py-3 px-1 gap-0.5"
          >
            <span className="text-base leading-none">{s.emoji}</span>
            <span className="text-sm font-bold text-sky-700 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {s.value}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">{s.unit}</span>
            <span className="text-[9px] text-slate-400 font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Sliding Window Chart ──────────────────────────────────────────────────────

function SlidingWindowChart() {
  const LINE_COLOR = '#0ea5e9'; // sky-500
  const BASELINE   = 150;

  return (
    <section className="px-4 pb-3">
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-sky-100">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-slate-700">Sliding Window · 30 min</p>
            <p className="text-[11px] text-slate-400 mt-0.5">PM2.5 vs. dynamic baseline</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-0.5 rounded" style={{ background: LINE_COLOR }} />
              PM2.5
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-4" style={{ borderBottom: '1.5px dashed #94a3b8' }} />
              Baseline
            </span>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              domain={[120, 205]}
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              tickCount={5}
            />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine
              y={BASELINE}
              stroke="#94a3b8"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{ value: 'Dynamic Baseline', position: 'insideTopLeft', fill: '#94a3b8', fontSize: 9, fontWeight: 600 }}
            />
            <Line
              type="monotoneX"
              dataKey="pm25"
              stroke={LINE_COLOR}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: LINE_COLOR, stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Spike annotation */}
        <div className="flex justify-end mt-1">
          <span className="text-[10px] font-bold rounded-full px-2.5 py-1" style={{ color: '#6E1A37', background: '#6E1A3710', border: '1px solid #6E1A3730' }}>
            ⚡ +40 spike at 23:50
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Alert Card ────────────────────────────────────────────────────────────────

function AlertCard() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="px-4 pb-2">
        <button
          onClick={() => setDismissed(false)}
          className="w-full text-center text-xs text-slate-400 hover:text-sky-500 transition-colors py-2"
        >
          Show last alert ↓
        </button>
      </div>
    );
  }

  return (
    <section className="px-4 pb-3 slide-down">
      <div className="rounded-3xl p-4 border relative shadow-sm" style={{ background: '#6E1A3708', borderColor: '#6E1A3725' }}>
        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs"
          style={{ color: '#6E1A3780' }}
          aria-label="Dismiss"
        >
          ✕
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#6E1A3715', border: '1px solid #6E1A3730' }}>
            <span className="text-lg">⚠️</span>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: '#6E1A37' }}>
              Context-Aware Alert
            </p>
            <p className="text-sm font-bold text-slate-700 leading-tight">Sudden Spike Detected</p>
          </div>
        </div>

        {/* Callout */}
        <div className="flex items-center gap-3 bg-white rounded-2xl px-3 py-2.5 mb-3 border shadow-xs" style={{ borderColor: '#6E1A3720' }}>
          <div>
            <span className="text-2xl font-black" style={{ color: '#6E1A37', fontFamily: "'Space Grotesk', sans-serif" }}>+40</span>
            <span className="text-xs text-slate-400 ml-1 font-medium">µg/m³ jump</span>
          </div>
          <div className="w-px h-8" style={{ background: '#6E1A3720' }} />
          <div>
            <p className="text-[10px] text-slate-400 font-medium">From baseline</p>
            <p className="text-xs font-bold text-slate-600">150 → 190 µg/m³</p>
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-slate-600 leading-relaxed font-medium mb-3">
          Sudden Spike Detected: PM2.5 jumped by{' '}
          <span className="font-bold" style={{ color: '#6E1A37' }}>40 µg/m³</span>. Likely a nearby source like{' '}
          <span className="font-bold" style={{ color: '#6E1A37' }}>heavy traffic or construction dust</span>.
        </p>

        <p className="text-[11px] text-slate-400 font-medium mb-3">
          📍 Detected near your location · 23:50 local time
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-xl text-xs font-semibold text-sky-600 bg-white border border-sky-200 hover:bg-sky-50 transition-colors shadow-xs">
            View Details
          </button>
          <button className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors shadow-xs" style={{ background: '#6E1A37' }}>
            Avoid Route
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── History Log ───────────────────────────────────────────────────────────────

function HistoryLog() {
  return (
    <section className="px-4 pb-12">
      {/* Label */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Spike History</p>
        <button className="text-[11px] text-sky-500 font-semibold hover:text-sky-400 transition-colors">
          View All ›
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {historyLog.map((entry, i) => (
          <div
            key={entry.id}
            className="bg-white rounded-2xl border border-sky-100 px-4 py-3.5 flex items-center gap-3 shadow-xs fade-up"
            style={{ animationDelay: `${i * 55}ms`, animationFillMode: 'both' }}
          >
            {/* Dot */}
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: entry.color, boxShadow: `0 0 0 3px ${entry.color}25` }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 truncate">{entry.source}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{entry.time}</p>
            </div>

            {/* Delta */}
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <div className="flex items-baseline gap-0.5">
                <span
                  className="text-sm font-black"
                  style={{ color: entry.color, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  +{entry.delta}
                </span>
                <span className="text-[9px] text-slate-400 font-medium"> µg/m³</span>
              </div>
              <span
                className="text-[9px] font-bold rounded-full px-1.5 py-0.5"
                style={{ color: entry.color, background: `${entry.color}15`, border: `1px solid ${entry.color}30` }}
              >
                {entry.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 30%, #f8fafc 100%)' }}>
      <div className="max-w-md mx-auto">
        <Header />
        <CurrentReading />
        <ConditionsRow />
        <SlidingWindowChart />
        <AlertCard />
        <HistoryLog />
      </div>
    </div>
  );
}
