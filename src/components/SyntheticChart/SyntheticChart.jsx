import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './SyntheticChart.module.css';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Synthetic-data chart with a working time-zone control
 * ─────────────────────────────────────────────────────────────────────────────
 * The production dashboards behind this portfolio cannot be shown. This is a
 * standalone rebuild of the two ideas that mattered in them — a readable time
 * series, and axis labels that resolve against the viewer's zone rather than
 * being rendered from raw timestamps.
 *
 * The data is invented and labelled as such, in the panel itself. It is not a
 * screenshot of anything and does not represent any real figures.
 *
 * Implementation notes, since this doubles as a code sample:
 *  - No charting library. The whole thing is ~200 lines of SVG.
 *  - Sized from a ResizeObserver rather than a fixed viewBox, so labels stay at
 *    a readable size at 320px instead of scaling to 6px.
 *  - Time formatting goes through Intl.DateTimeFormat with an explicit
 *    `timeZone`, which is the part that actually does the work: one canonical
 *    UTC series, resolved per viewer.
 *  - The SVG is aria-hidden and paired with a real data table, because a chart
 *    traversed node-by-node by a screen reader is noise.
 */

const ZONES = [
  { id: 'Asia/Kolkata', label: 'IST' },
  { id: 'UTC', label: 'UTC' },
  { id: 'Europe/London', label: 'London' },
  { id: 'America/New_York', label: 'New York' },
];

// A fixed base instant keeps the series identical on every render and every
// visit — this is a demonstration, not a live feed pretending to be one.
const BASE_UTC = Date.UTC(2026, 0, 14, 0, 0, 0);

/** Deterministic pseudo-random so the shape is stable across reloads. */
function noise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const SERIES = Array.from({ length: 24 }, (_, hour) => {
  // A plausible daily curve: quiet overnight, a morning climb, an afternoon peak.
  const shape = Math.sin(((hour - 4) / 24) * Math.PI * 2) * 0.5 + 0.5;
  const value = Math.round(120 + shape * 480 + noise(hour + 1) * 90);
  return { t: BASE_UTC + hour * 3_600_000, v: value };
});

const PAD = { top: 16, right: 16, bottom: 28, left: 40 };
const HEIGHT = 220;

export function SyntheticChart() {
  const [zone, setZone] = useState(ZONES[0].id);
  const [activeIndex, setActiveIndex] = useState(null);
  const [width, setWidth] = useState(560);
  const wrapRef = useRef(null);

  // Real measured width, re-measured on resize. A fixed-width SVG from a
  // charting library is a classic source of horizontal overflow at 320px.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;

    const ro = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect?.width;
      if (next) setWidth(Math.max(260, Math.round(next)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: zone,
      }),
    [zone],
  );

  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        timeZone: zone,
      }),
    [zone],
  );

  const plotWidth = Math.max(1, width - PAD.left - PAD.right);
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  const { max, min } = useMemo(() => {
    const values = SERIES.map((d) => d.v);
    return { max: Math.max(...values), min: Math.min(...values) };
  }, []);

  // Round the scale out to a clean ceiling so the gridlines land on readable
  // numbers rather than on the data's exact extremes.
  const scaleMax = Math.ceil(max / 100) * 100;
  const scaleMin = Math.max(0, Math.floor(min / 100) * 100 - 100);

  const x = useCallback(
    (i) => PAD.left + (i / (SERIES.length - 1)) * plotWidth,
    [plotWidth],
  );

  const y = useCallback(
    (v) => PAD.top + plotHeight - ((v - scaleMin) / (scaleMax - scaleMin)) * plotHeight,
    [plotHeight, scaleMax, scaleMin],
  );

  const linePath = useMemo(
    () => SERIES.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.v).toFixed(1)}`).join(' '),
    [x, y],
  );

  const areaPath = useMemo(
    () =>
      `${linePath} L${x(SERIES.length - 1).toFixed(1)},${(PAD.top + plotHeight).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + plotHeight).toFixed(1)} Z`,
    [linePath, x, plotHeight],
  );

  // Fewer x labels when there is less room, rather than overlapping ticks.
  const labelEvery = width < 420 ? 8 : width < 620 ? 6 : 4;
  const gridValues = [scaleMin, (scaleMin + scaleMax) / 2, scaleMax];

  const active = activeIndex === null ? null : SERIES[activeIndex];

  const handlePointerMove = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const relative = event.clientX - rect.left - PAD.left;
      const ratio = relative / plotWidth;
      const index = Math.round(ratio * (SERIES.length - 1));
      setActiveIndex(Math.min(SERIES.length - 1, Math.max(0, index)));
    },
    [plotWidth],
  );

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveIndex((current) => {
        const start = current ?? 0;
        const next = event.key === 'ArrowRight' ? start + 1 : start - 1;
        return Math.min(SERIES.length - 1, Math.max(0, next));
      });
    }
    if (event.key === 'Escape') setActiveIndex(null);
  }, []);

  return (
    <section className={styles.panel} aria-labelledby="demo-title">
      <header className={styles.head}>
        <div>
          <h3 className={styles.title} id="demo-title">
            Time series, resolved per zone
          </h3>
          <p className={styles.subtitle}>
            One canonical UTC series. Change the zone and every label re-resolves —
            the data does not move.
          </p>
        </div>
        <span className={styles.simTag}>Simulation · synthetic data</span>
      </header>

      <div className={styles.controls} role="group" aria-label="Display time zone">
        {ZONES.map((z) => (
          <button
            key={z.id}
            type="button"
            className={styles.zoneButton}
            aria-pressed={zone === z.id}
            onClick={() => setZone(z.id)}
          >
            {z.label}
          </button>
        ))}
      </div>

      <p className={styles.dayLabel}>
        <span className="u-sr-only">Showing </span>
        {dayFormatter.format(new Date(SERIES[0].t))}
        <span className={styles.zoneName}> · {zone}</span>
      </p>

      <div ref={wrapRef} className={styles.chartWrap}>
        <svg
          className={styles.svg}
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          role="img"
          aria-label={`Synthetic 24-hour series, peaking at ${max} around the afternoon, with hourly labels shown in ${zone}. The full figures are in the data table below.`}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(null)}
          onKeyDown={handleKeyDown}
          onFocus={() => setActiveIndex((c) => c ?? 12)}
          onBlur={() => setActiveIndex(null)}
          tabIndex={0}
        >
          <defs>
            <linearGradient id="ssArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridValues.map((value) => (
            <g key={value}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(value)}
                y2={y(value)}
                className={styles.grid}
              />
              <text x={PAD.left - 8} y={y(value) + 4} className={styles.axisLabel} textAnchor="end">
                {value}
              </text>
            </g>
          ))}

          <path d={areaPath} fill="url(#ssArea)" />
          <path d={linePath} className={styles.line} />

          {SERIES.map((d, i) =>
            i % labelEvery === 0 ? (
              <text
                key={d.t}
                x={x(i)}
                y={HEIGHT - 8}
                className={styles.axisLabel}
                textAnchor={i === 0 ? 'start' : 'middle'}
              >
                {formatter.format(new Date(d.t))}
              </text>
            ) : null,
          )}

          {active && (
            <g>
              <line
                x1={x(activeIndex)}
                x2={x(activeIndex)}
                y1={PAD.top}
                y2={PAD.top + plotHeight}
                className={styles.cursor}
              />
              <circle cx={x(activeIndex)} cy={y(active.v)} r="4" className={styles.dot} />
            </g>
          )}
        </svg>

        {active && (
          <output className={styles.readout} aria-live="polite">
            <span className={styles.readoutValue}>{active.v}</span>
            <span className={styles.readoutTime}>
              {formatter.format(new Date(active.t))} {zone}
            </span>
          </output>
        )}
      </div>

      <p className={styles.hint}>
        Hover, or focus the chart and use ← →.
      </p>

      <details className={styles.tableDetails}>
        <summary className={styles.summary}>View the underlying figures</summary>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <caption className="u-sr-only">
              Synthetic hourly series, times shown in {zone}
            </caption>
            <thead>
              <tr>
                <th scope="col">Time ({zone})</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {SERIES.map((d) => (
                <tr key={d.t}>
                  <td>{formatter.format(new Date(d.t))}</td>
                  <td className="u-tabular">{d.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
