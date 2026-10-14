# ZARA CARS — Cinematic Luxury Automotive Showroom & Management Suite

> *"Best Price & Best Service Is Our Assurance"*  
> Pre-Owned Luxury Automotive Dealership · Established 2023 · No. 1, Sri Balaji Complex, Kanchipuram to Chengalpattu Main Road

---

## Overview

**Zara Cars** is a high-end, cinematic automotive web platform crafted for a premier certified pre-owned luxury car dealership. The application combines interactive editorial storytelling with a dealership inventory management suite.

---

## Key Features

### 1. Cinematic Public Showroom (`/`)
* **Opening Preloader**: Branded sequence with signature chrome emblem and tagline reveal.
* **Cinema Ignition Hero**: Dark showroom visual with interactive headlight ignition toggle, dynamic lens flare, and telemetry HUD.
* **Interactive 140-Point Telemetry Scrub**: Pinned scroll inspection stages (Diagnostics, Chassis Structural Guarantee, Cabin & Title) with interactive hotspot pins.
* **Horizontal Fleet Runway**: Pinned horizontal showcase of certified vehicles with performance badges.
* **Certified Inventory & Filter Engine**: Multi-criteria vehicle filtering by category (Luxury Sedan, Performance Coupe, Full-Size SUV, Executive EV) and budget brackets (Under ₹50L, ₹50L–₹1Cr, ₹1Cr+).
* **Vehicle Detail Modal**: Comprehensive specifications sheet with engine specs, transmission, ownership, and one-click WhatsApp concierge enquiry.
* **Instant Trade-In Valuation Calculator**: Dynamic interactive vehicle exchange estimator with spot bank-transfer guarantees.
* **Showroom Map & Location**: Interactive Google Maps embed with direct navigation links to Sri Balaji Complex showroom.

### 2. Dealership Admin Management Suite (`/admin`)
* **Secure Authentication**: Demo authentication with instant one-click login and optional Firebase Authentication.
* **Executive KPI Dashboard**: Real-time metrics tracking active fleet count, total portfolio valuation, pending appraisals, and verified status.
* **Dual-Mode Data Storage**: Seamlessly switches between live Google Cloud Firestore and persistent local storage fallback.
* **Complete CRUD Inventory Management**: Add, edit, remove, and manage car listings with full image gallery, pricing, technical specs, fuel type, transmission, and availability statuses (*Available*, *Reserved*, *Sold*).

---

## Tech Stack

* **Frontend**: React 19, React Router v7
* **Build Tool**: Vite 8
* **Animations & Physics**: GSAP 3.15 (ScrollTrigger, matchMedia), Lenis Smooth Scroll
* **Icons**: Phosphor Icons, Lucide React
* **Styling**: Modern Vanilla CSS Design System with custom dark/champagne design tokens
* **Backend & Database**: Firebase 13 (Firestore, Auth, Storage) with zero-config LocalStorage fallback

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/rahim-007/zara-cars.git

# Enter project directory
cd zara-cars

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Admin Suite Access

* Open: `http://localhost:5173/admin/login`
* Click **"Quick Demo Login"** or use the credentials:
  * **Email**: `admin@zaracars.com`
  * **Password**: `zara2026`

---

## Production Build

```bash
npm run build
npm run preview
```

---

## Dealership Showroom

* **Location**: No. 1, Sri Balaji Complex, Kanchipuram to Chengalpattu Road, Tamil Nadu
* **Hours**: Monday – Sunday, 09:30 AM – 08:30 PM
