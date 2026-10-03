# ITZFIZZ — Kinetic Velocity Scroll Animation

[![Live Demo](https://img.shields.io/badge/Live-Demo%20Page-brightgreen?style=for-the-badge&logo=githubpages)](https://yash12991.github.io/itzfizz-scroll-animation/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/yash12991/itzfizz-scroll-animation)
[![GSAP 3](https://img.shields.io/badge/Powered%20By-GSAP%203.12-88CE02?style=for-the-badge&logo=greensock)](https://greensock.com/)
[![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](LICENSE)

An ultra-fluid, hardware-accelerated hero section and highway scroll interaction inspired by the reference [Car Scroll Animation](https://paraschaturvedi.github.io/car-scroll-animation). Engineered with vanilla web technologies, GSAP 3, and ScrollTrigger to deliver a high-velocity, 60+ FPS digital experience.

---

## 🔗 Submission Links

- **Live Webpage**: [https://yash12991.github.io/itzfizz-scroll-animation/](https://yash12991.github.io/itzfizz-scroll-animation/)
- **GitHub Repository**: [https://github.com/yash12991/itzfizz-scroll-animation](https://github.com/yash12991/itzfizz-scroll-animation)

---

## ⚡ Key Highlights & Functional Implementation

### 1. Hero Section Layout (Above the Fold)
- **First Screen Experience**: Fully occupies the initial viewport (`100vh`) with an obsidian dark theme, neon accents, and ambient radial glow.
- **Letter-Spaced Headline**: Prominently features the kinetic headline `W E L C O M E   I T Z F I Z Z`, separated into individual letter spans with custom 3D perspective.
- **Impact Metrics & Statistics**: A 4-column responsive grid showcasing critical performance indicators:
  - **58%** — Pick-up point utilization surge
  - **23%** — Decrease in inbound customer phone inquiries
  - **27%** — Uplift in user retention & engagement
  - **40%** — Acceleration in fulfillment throughput
- **Scroll Invitation**: Pulsing mouse wheel and chevron prompting the user to accelerate down the track.

### 2. Initial Load Animation
- **Staggered Timeline**: Orchestrated with a master GSAP timeline on initial load:
  1. Top navigation slide-down with backdrop blur.
  2. Category badge scale and fade-in.
  3. Staggered 3D reveal of individual letters (`y: 60`, `rotateX: -35deg`, `opacity: 0 -> 1`).
  4. Smooth subtitle arrival.
  5. Sequential arrival of impact metric cards with elastic easing (`back.out(1.2)`).
  6. Dynamic numerical count-up animation from 0 to target percentages accompanied by animated progress meters.

### 3. Scroll-Based Highway Animation (Core Feature)
- **Pinned Viewport Navigation**: Smooth pinning (`pin: true`, `anticipatePin: 1`) of the highway track over a 320vh scroll travel distance.
- **Sub-Pixel Vehicle Scrubbing**: A high-resolution top-view McLaren 720S sports car moves horizontally across the asphalt road with momentum damping (`scrub: 1.2`) for natural mechanical inertia.
- **Dynamic Nitro / Tire Trail**: An electric cyan-to-emerald gradient trail expands behind the rear wheels in continuous lockstep with the car's motion.
- **Synchronized Highway Typography**: The tarmac contains the letter-spaced `W E L C O M E   I T Z F I Z Z` stencil. As the car's front axle passes each letter, the letter dynamically illuminates into a high-contrast dark stencil with a vivid lime neon halo.
- **Milestone Floating Callouts**: 4 glassmorphic telemetry cards with radar connector lines positioned along the highway journey. As the car approaches each station, the corresponding milestone illuminates, and upon departure, it recedes gracefully to avoid visual clutter.

### 4. Real-Time Cockpit Telemetry HUD
- **Dynamic Speedometer**: Calculates instantaneous scroll velocity using `ScrollTrigger.getVelocity()` with a decay lerp ticker, outputting realistic 0–240 KM/H speeds.
- **Dynamic 7-Speed Transmission**: Simulates automatic gear shifting (`N` → `1` → `2` → `3` → `4` → `5` → `6` → `7`) based on velocity and distance.
- **Distance & Completion Counters**: Real-time progress percentage (0–100%) and odometer (0 / 1200 M).
- **Interactive Manual Scrubber**: Draggable slider allowing users to manually scrub the car's position directly.
- **Auto-Cruise Drive Mode**: A one-click automated cruise control button that smoothly glides the camera through the complete journey.
- **Synthesized Web Audio Engine FX**: Interactive engine audio toggle powered by the HTML5 Web Audio API (sawtooth oscillator + dynamic low-pass sweep) with zero external audio assets.

### 5. Motion Quality & Performance Architecture
- **GPU Composite Layers**: All dynamic motion utilizes `transform: translate3d()` and `opacity` with CSS `will-change`.
- **Zero Layout Thrashing**: Eliminates scroll reflows by decoupling render loops and caching DOM coordinates.
- **Debounced Viewport Recalculation**: Automatically recalculates bounding boxes and refreshes ScrollTrigger geometry on window resize across desktop, tablet, and mobile screens.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic, accessible markup with OpenGraph and SEO tags.
- **CSS3 (Vanilla)**: Design token architecture, CSS grid/flexbox, glassmorphism, glowing tracks, and responsive media queries.
- **JavaScript (ES6+)**: Modular interaction scripts and Web Audio API synthesizer.
- **GSAP 3.12.5**: `gsap.core`, `ScrollTrigger`, `ScrollToPlugin`.

---

## 📂 Project Structure

```bash
├── index.html               # Main semantic HTML structure
├── css/
│   └── style.css            # Design tokens, layouts, glassmorphism, animations
├── js/
│   └── main.js              # GSAP load timeline, ScrollTrigger, HUD telemetry, audio FX
├── assets/
│   └── images/
│       └── car.png          # High-resolution McLaren 720S top-view PNG asset
├── README.md                # Comprehensive project documentation
└── LICENSE                  # MIT License
```

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yash12991/itzfizz-scroll-animation.git
   cd itzfizz-scroll-animation
   ```

2. **Serve with any local HTTP server**:
   ```bash
   # Using Python 3
   python3 -m http.server 8080

   # Or using Node.js
   npx serve .
   ```

3. Open your browser and navigate to `http://localhost:8080/`.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
