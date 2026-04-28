# AeroContext — Context-Aware Air Quality Monitor

A mobile-first, responsive web dashboard prototype for monitoring real-time PM2.5 air quality, built specifically for high-pollution environments like Dhaka, Bangladesh. The app uses a sliding window baseline algorithm to detect and surface sudden pollution spikes above the local ambient level.

---

## UI Overview

The interface is designed to feel like a native mobile app when opened on a smartphone. It uses a clean light theme — a sky-blue gradient background, white cards, and a deep burgundy (`#6E1A37`) accent color for all spike indicators.

### Header

- **App name** — AeroContext, in Space Grotesk typeface
- **Location** — Dhaka, Bangladesh displayed below the title
- **BLE Connected pill** — animated green pulsing indicator simulating a live Bluetooth link to the sensor hardware

### Current PM2.5 Reading

- Large animated counter that counts up from the baseline (150) to the current reading (**190 µg/m³**) on load
- Displayed in the signature burgundy `#6E1A37` to signal an active spike
- **SPIKE ⚡** badge in the top-right corner of the card
- **+40 µg/m³ above dynamic baseline (150)** delta note with an upward triangle icon
- A colour-coded AQI gradient bar (Good → Hazardous) with a live position marker
- Footer stats row: **AQI 248** · **Very Unhealthy** · **Updated 23:50**

### Ambient Conditions Row

Four compact stat tiles showing:

| Stat | Value |
|---|---|
| Wind | 3.2 km/h |
| Humidity | 78% |
| Temperature | 29 °C |
| Visibility | 1.1 km |

### Sliding Window Chart (30 min)

- **Recharts** `LineChart` rendering 30 data points across a 30-minute window
- The line hovers around the baseline of **150 µg/m³** with natural noise (±6) for the first ~25 points
- A sharp ramp at the far right jumps from 150 → 156 → 165 → 175 → 184 → **190** to visually demonstrate the spike
- A dashed **Dynamic Baseline** reference line at 150
- A custom hover tooltip that highlights spike points with the burgundy accent
- **⚡ +40 spike at 23:50** annotation pill in the bottom-right corner

### Context-Aware Alert Card

A soft burgundy-tinted card that slides in below the chart:

- **Context-Aware Alert** label + **Sudden Spike Detected** heading
- Callout block: **+40 µg/m³ jump** | From baseline 150 → 190 µg/m³
- Alert body: *"Sudden Spike Detected: PM2.5 jumped by 40 µg/m³. Likely a nearby source like heavy traffic or construction dust."*
- Location note and timestamp
- Two action buttons: **View Details** (outlined) and **Avoid Route** (filled burgundy)
- Dismissible via the ✕ button; can be restored with "Show last alert ↓"

### Spike History Log

A vertical list of five recent spike events, each shown as a white card containing:

- A coloured dot indicator
- Source label (e.g. *Heavy traffic / construction dust*)
- Timestamp (e.g. *Today · 23:50*)
- Delta value (e.g. **+40 µg/m³**) and an AQI category badge (*Hazardous* / *Very Unhealthy*)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons & fonts | Lucide React · Inter · Space Grotesk (Google Fonts) |

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. For the best experience, use your browser's responsive design mode set to ~430px width to simulate a mobile viewport.

## Production Build

```bash
npm run build
```

Output is written to `dist/`. Deploy the contents of that folder to any static host (Vercel, Netlify, GitHub Pages, etc.).
