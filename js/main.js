/**
 * ITZFIZZ — Kinetic Automotive Scroll Animation Engine
 * Engineered with GSAP 3 + ScrollTrigger + ScrollToPlugin
 */

(function () {
  'use strict';

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // DOM Elements
  const car = document.getElementById('car');
  const carContainer = document.getElementById('carContainer');
  const carTrail = document.getElementById('carTrail');
  const road = document.getElementById('road');
  const roadTypography = document.getElementById('roadTypography');
  const trackLetters = gsap.utils.toArray('.track-letter');
  const speedDisplay = document.getElementById('speedDisplay');
  const speedBarFill = document.getElementById('speedBarFill');
  const gearDisplay = document.getElementById('gearDisplay');
  const progressDisplay = document.getElementById('progressDisplay');
  const distanceDisplay = document.getElementById('distanceDisplay');
  const manualScrub = document.getElementById('manualScrub');
  const autoDriveBtn = document.getElementById('autoDriveBtn');
  const autoDriveText = document.getElementById('autoDriveText');
  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');
  const restartTripBtn = document.getElementById('restartTripBtn');
  const scrollPrompt = document.getElementById('scrollPrompt');

  // State
  let isAutoDriving = false;
  let isAudioEnabled = false;
  let audioCtx = null;
  let engineOsc = null;
  let engineGain = null;
  let engineFilter = null;
  let letterCoordinates = [];
  let trackScrollTrigger = null;

  // Realtime Telemetry Smoothing
  let targetSpeed = 0;
  let currentSpeed = 0;

  /* ==========================================================================
     1. INITIAL LOAD ANIMATION (Hero Above-The-Fold)
     ========================================================================== */
  function runInitialLoadAnimation() {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onComplete: () => {
        animateStatCounters();
      }
    });

    // 1. Navbar slide down
    tl.from('#navbar', {
      y: -50,
      opacity: 0,
      duration: 0.9
    });

    // 2. Hero Badge pop
    tl.from('#heroBadge', {
      scale: 0.85,
      opacity: 0,
      duration: 0.6
    }, '-=0.5');

    // 3. Staggered Headline letters reveal
    tl.from('.hero-title .letter', {
      y: 60,
      opacity: 0,
      rotateX: -35,
      stagger: 0.035,
      duration: 0.9
    }, '-=0.4');

    // 4. Subtitle fade in
    tl.from('#heroSubtitle', {
      y: 25,
      opacity: 0,
      duration: 0.8
    }, '-=0.5');

    // 5. Statistics cards staggered entry
    tl.fromTo('.stat-card', 
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.12,
        duration: 0.85,
        ease: 'back.out(1.2)'
      }, 
      '-=0.4'
    );

    // 6. Scroll prompt pulse
    tl.fromTo('#scrollPrompt',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.3'
    );
  }

  /* Animate Number Counters on Initial Load */
  function animateStatCounters() {
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach((card) => {
      const numEl = card.querySelector('.stat-number');
      const fillEl = card.querySelector('.stat-fill');
      const targetVal = parseFloat(card.getAttribute('data-target')) || 0;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: targetVal,
        duration: 1.6,
        ease: 'power3.out',
        onUpdate: () => {
          numEl.textContent = Math.round(obj.val);
        }
      });

      if (fillEl) {
        fillEl.style.width = targetVal + '%';
      }
    });
  }

  /* ==========================================================================
     2. DYNAMIC GEOMETRY RECALCULATION
     ========================================================================== */
  function computeLetterCoordinates() {
    if (!road || !trackLetters.length) return;
    const roadRect = road.getBoundingClientRect();
    
    letterCoordinates = trackLetters.map((letter) => {
      const rect = letter.getBoundingClientRect();
      // Distance of letter's center relative to road's left edge
      return (rect.left - roadRect.left) + (rect.width / 2);
    });
  }

  /* ==========================================================================
     3. SCROLL-BASED VEHICLE & TRACK ANIMATION (Core Feature)
     ========================================================================== */
  function initScrollAnimation() {
    computeLetterCoordinates();

    const roadWidth = window.innerWidth;
    const carWidth = carContainer.offsetWidth || 240;
    // Travel from start to the very edge of the road
    const endX = roadWidth - carWidth;

    // Main Car Drive ScrollTrigger with frame-perfect scrub tracking
    trackScrollTrigger = gsap.to(carContainer, {
      scrollTrigger: {
        trigger: '#trackSection',
        start: 'top top',
        end: 'bottom bottom',
        pin: '#pinnedTrack',
        scrub: 1.2, // Smooth momentum damping
        anticipatePin: 1
      },
      x: endX,
      ease: 'none',
      onUpdate: function () {
        const self = this.scrollTrigger;
        handleMotionUpdate(self, carWidth);
      }
    });

    // Milestone Floating Stat Cards (Staggered reveals along the highway journey)
    const milestoneConfigs = [
      { id: '#box1', startOffset: 0.10, endOffset: 0.25 },
      { id: '#box2', startOffset: 0.28, endOffset: 0.45 },
      { id: '#box3', startOffset: 0.48, endOffset: 0.65 },
      { id: '#box4', startOffset: 0.68, endOffset: 0.88 }
    ];

    milestoneConfigs.forEach((m, idx) => {
      const isLast = idx === milestoneConfigs.length - 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#trackSection',
          start: () => `top+=${m.startOffset * window.innerHeight * 2.2} top`,
          end: () => `top+=${(m.endOffset + (isLast ? 0.4 : 0.2)) * window.innerHeight * 2.2} top`,
          scrub: true
        }
      });

      tl.fromTo(m.id, 
        { opacity: 0, y: 25, scale: 0.92 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' }
      );

      if (!isLast) {
        tl.to(m.id, {
          opacity: 0.2,
          y: -10,
          scale: 0.95,
          duration: 0.6,
          ease: 'power1.in'
        }, '+=0.6');
      }
    });
  }

  /* Handler on every frame of the pinned vehicle motion */
  function handleMotionUpdate(self, carWidth) {
    const currentX = gsap.getProperty(carContainer, 'x') || 0;
    const carMidpoint = currentX + (carWidth * 0.45); // Headlights / front axle

    // 1. Dynamic Nitro Trail strictly connected to rear wheels
    if (carTrail) {
      const trailWidth = Math.max(0, currentX + (carWidth * 0.15));
      carTrail.style.width = trailWidth + 'px';
    }

    // 2. Illuminate Road Headline Typography dynamically as car passes
    trackLetters.forEach((letter, idx) => {
      const letterPos = letterCoordinates[idx];
      if (letterPos !== undefined && carMidpoint >= letterPos) {
        letter.classList.add('illuminated');
      } else {
        letter.classList.remove('illuminated');
      }
    });

    if (!self) return;

    // 3. Track Completion and Distance Telemetry
    const progressPercent = Math.round(self.progress * 100);
    if (progressDisplay) progressDisplay.textContent = progressPercent;
    if (distanceDisplay) distanceDisplay.textContent = `${Math.round(self.progress * 1200)} / 1200 M`;
    if (manualScrub && !manualScrub.matches(':active')) {
      manualScrub.value = progressPercent;
    }

    // 4. Calculate instantaneous scroll velocity for sports car speedometer
    let velocity = 0;
    if (typeof self.getVelocity === 'function') {
      velocity = Math.abs(self.getVelocity());
    } else {
      const currentScroll = self.scroll();
      velocity = Math.abs(currentScroll - (window.__lastScrollPos || currentScroll)) * 60;
      window.__lastScrollPos = currentScroll;
    }
    // Scale scroll velocity into realistic KM/H range (0 - 240)
    const scaledSpeed = Math.min(240, Math.round(velocity * 0.045));
    targetSpeed = Math.max(targetSpeed, scaledSpeed);

    // Dynamic Gear shifting
    updateGear(scaledSpeed, self.progress);

    // Audio frequency shift if enabled
    if (isAudioEnabled && engineOsc) {
      updateEngineSound(scaledSpeed);
    }
  }

  /* Smooth Telemetry Ticker (Lerp speed towards 0 when stopped) */
  gsap.ticker.add(() => {
    // Decay target speed smoothly
    targetSpeed *= 0.94;
    currentSpeed += (targetSpeed - currentSpeed) * 0.15;

    const displaySpeed = Math.round(currentSpeed);
    if (speedDisplay) speedDisplay.textContent = displaySpeed;
    if (speedBarFill) speedBarFill.style.width = `${(currentSpeed / 240) * 100}%`;
  });

  /* Calculate realistic gear from speed & progress */
  function updateGear(speed, progress) {
    if (!gearDisplay) return;
    if (speed < 5) {
      gearDisplay.textContent = 'N';
      return;
    }
    if (speed < 30) {
      gearDisplay.textContent = '1';
    } else if (speed < 60) {
      gearDisplay.textContent = '2';
    } else if (speed < 95) {
      gearDisplay.textContent = '3';
    } else if (speed < 135) {
      gearDisplay.textContent = '4';
    } else if (speed < 175) {
      gearDisplay.textContent = '5';
    } else if (speed < 210) {
      gearDisplay.textContent = '6';
    } else {
      gearDisplay.textContent = '7';
    }
  }

  /* ==========================================================================
     4. INTERACTIVE CONTROLS (Auto-Drive, Manual Scrubber, Audio FX)
     ========================================================================== */

  // Auto-Cruise Drive Mode
  if (autoDriveBtn) {
    autoDriveBtn.addEventListener('click', toggleAutoDrive);
  }

  function toggleAutoDrive() {
    if (isAutoDriving) {
      stopAutoDrive();
    } else {
      startAutoDrive();
    }
  }

  let autoDriveTween = null;

  function startAutoDrive() {
    isAutoDriving = true;
    if (autoDriveText) autoDriveText.textContent = 'PAUSE CRUISE';
    if (autoDriveBtn) autoDriveBtn.classList.add('active');

    const trackSection = document.getElementById('trackSection');
    if (!trackSection) return;

    const targetScroll = trackSection.offsetTop + trackSection.offsetHeight - window.innerHeight;
    const scrollObj = { y: window.pageYOffset };

    if (autoDriveTween) autoDriveTween.kill();

    autoDriveTween = gsap.to(scrollObj, {
      y: targetScroll,
      duration: 7,
      ease: 'power1.inOut',
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
      },
      onComplete: () => {
        stopAutoDrive();
      }
    });
  }

  function stopAutoDrive() {
    isAutoDriving = false;
    if (autoDriveTween) {
      autoDriveTween.kill();
      autoDriveTween = null;
    }
    if (autoDriveText) autoDriveText.textContent = 'AUTO DRIVE';
    if (autoDriveBtn) autoDriveBtn.classList.remove('active');
  }

  // Manual Scrubber Slider
  if (manualScrub) {
    manualScrub.addEventListener('input', (e) => {
      stopAutoDrive();
      const progress = parseFloat(e.target.value) / 100;
      const trackSection = document.getElementById('trackSection');
      if (!trackSection) return;

      const trackScrollStart = trackSection.offsetTop;
      const trackScrollDistance = trackSection.offsetHeight - window.innerHeight;
      const targetY = trackScrollStart + (progress * trackScrollDistance);

      window.scrollTo(0, targetY);
    });
  }

  // Scroll to track when clicking scroll prompt
  if (scrollPrompt) {
    scrollPrompt.addEventListener('click', () => {
      const trackSection = document.getElementById('trackSection');
      if (trackSection) {
        trackSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Restart Journey Button
  if (restartTripBtn) {
    restartTripBtn.addEventListener('click', () => {
      stopAutoDrive();
      const scrollObj = { y: window.pageYOffset };
      gsap.to(scrollObj, {
        y: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        }
      });
    });
  }

  /* ==========================================================================
     5. SYNTHESIZED WEB AUDIO API ENGINE SOUND
     ========================================================================== */
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!isAudioEnabled) {
        initAudioEngine();
      } else {
        disableAudioEngine();
      }
    });
  }

  function initAudioEngine() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Create engine oscillator (sawtooth for aggressive engine tone)
      engineOsc = audioCtx.createOscillator();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.setValueAtTime(45, audioCtx.currentTime);

      // Low-pass filter to simulate exhaust throat
      engineFilter = audioCtx.createBiquadFilter();
      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(320, audioCtx.currentTime);

      // Gain master
      engineGain = audioCtx.createGain();
      engineGain.gain.setValueAtTime(0.04, audioCtx.currentTime);

      // Connect nodes
      engineOsc.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(audioCtx.destination);

      engineOsc.start();
      isAudioEnabled = true;

      if (audioIcon) audioIcon.textContent = '🔊';
      if (audioLabel) audioLabel.textContent = 'ENGINE FX: ON';
      if (audioToggle) audioToggle.classList.add('btn-accent');
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  function disableAudioEngine() {
    isAudioEnabled = false;
    if (engineOsc) {
      try {
        engineOsc.stop();
        engineOsc.disconnect();
      } catch (e) {}
    }
    if (audioIcon) audioIcon.textContent = '🔇';
    if (audioLabel) audioLabel.textContent = 'ENGINE FX: OFF';
    if (audioToggle) audioToggle.classList.remove('btn-accent');
  }

  function updateEngineSound(speed) {
    if (!audioCtx || !engineOsc || !engineFilter) return;
    const now = audioCtx.currentTime;
    // Base 45 Hz up to 260 Hz based on speed
    const targetFreq = 45 + (speed * 0.9);
    engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    engineFilter.frequency.setTargetAtTime(300 + (speed * 4), now, 0.08);
  }

  /* ==========================================================================
     6. RESIZE LISTENER & LIFECYCLE
     ========================================================================== */
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      computeLetterCoordinates();
      ScrollTrigger.refresh();
    }, 200);
  });

  // Kickoff on DOM Loaded
  window.addEventListener('DOMContentLoaded', () => {
    runInitialLoadAnimation();
    initScrollAnimation();
  });

})();
