# ⊕ WhereAmI

A sleek location app built with **React + Vite + TypeScript** that uses your browser's Geolocation API + Google Maps Geocoding API to show exactly where you are.

## Features

- 📍 Browser geolocation (high accuracy)
- 🗺️ Reverse geocoding via Google Maps API — street address, city & country
- 📐 Latitude & longitude with accuracy radius
- 📋 Click-to-copy coordinates
- 🔑 API key loaded securely from `.env`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

Copy `.env.example` to `.env` and add your key:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

Get a key from [Google Cloud Console](https://console.cloud.google.com/). Enable:
- **Geocoding API** — for reverse geocoding

### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click **LOCATE ME**.

## Build

```bash
npm run build
```

## Tech Stack

- Vite 5 + React 18 + TypeScript
- Google Maps Geocoding REST API
- Browser Geolocation API
- CSS Modules
- Google Fonts (Syne + Space Mono)
