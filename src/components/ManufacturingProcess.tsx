'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Disc, Scissors, Cog, Crosshair, Sparkles } from 'lucide-react';

const STAGES = [
  {
    num: '01',
    heading: 'Centrifugal Drum Casting',
    sub: 'Continuous bronze drum curing producing void-free sheets.',
    title: '01 — Centrifugal Drum Casting & Bio-Polymerisation',
    desc: 'Liquid organic polyester resin and natural plant-derived monomers are poured into high-speed rotating bronze cylinders. An exothermic thermal reaction cures the liquid into flawless continuous cylindrical sheets with uniform tensile density. (Curing Tolerance: ±0.04mm · Drum Speed: 1,850 RPM)',
    img: '/assets/factory_lathe.jpg',
    icon: Disc,
  },
  {
    num: '02',
    heading: 'Diamond Disc Slicing & Punching',
    sub: 'Optical laser inspection punches 450 precision blanks per minute.',
    title: '02 — Diamond Gang-Saw Slicing & Precision Blank Stamping',
    desc: 'Cylinder rods and Tagua nut blocks pass through water-cooled diamond gang saws. High-speed pneumatic punches stamp raw circular blanks with micrometer thickness control, calibrated for zero edge micro-fractures. (Output: 450 blanks / min · Caliber: 14L–60L)',
    img: '/assets/materials_archive.jpg',
    icon: Scissors,
  },
  {
    num: '03',
    heading: 'Italian Bianchi Lathe Turning',
    sub: 'Dual-spindle diamond tools shape dish, bevel, and rim crowns.',
    title: '03 — Italian Bianchi Lathe Shaping & Profile Carving',
    desc: 'Automated Bianchi turning lathes secure blanks in pneumatic collets. High-speed PCD diamond tools carve face dishes, bevel angles, and rim profiles in a single 1.4-second synchronized pass with aerospace tolerance. (Accuracy: ±0.02mm · Spindle Speed: 4,800 RPM)',
    img: '/assets/factory_lathe.jpg',
    icon: Cog,
  },
  {
    num: '04',
    heading: 'Diamond Core Drilling & Chamfering',
    sub: 'Countersunk 45° bevels ensure zero thread shearing under tension.',
    title: '04 — Diamond Core Drilling & 45° Micro-Chamfering',
    desc: 'Dual-action high-frequency drills bore aperture stitch holes simultaneously. An integrated counter-sinking tool chamfers inner hole rims at 45°, eliminating sharp burrs that cause thread abrasion under industrial sewing machines. (Hole Concentricity: 0.01mm)',
    img: '/assets/hero_craft.jpg',
    icon: Crosshair,
  },
  {
    num: '05',
    heading: '72h Organic Walnut Tumbling',
    sub: 'Three days in crushed walnut shells & pumice for silky tactile finish.',
    title: '05 — 72-Hour Progressive Beechwood Tumbling Cascade',
    desc: 'Buttons are transferred into octagonal Italian beechwood drums filled with crushed Sicilian pumice, walnut shells, and beeswax pellets. Continuous three-day tumbling polishes surfaces to a rich tactile eggshell luster without chemical lacquer. (Duration: 72 Hours · Eco-Impact: 0% VOC)',
    img: '/assets/hero_craft.jpg',
    icon: Sparkles,
  }
];

export default function ManufacturingProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = STAGES[activeStep];

  // Auto-scrub progress loop
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const intervalMs = 50;
    const totalDurationMs = 4500;
    const stepIncrement = (intervalMs / totalDurationMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((s) => (s + 1) % STAGES.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
    setProgress(0);
  };

  return (
    <section className="process-section" id="process-section">
      <span id="process" style={{ display: 'none' }}></span>
      <div className="section-head-editorial">
        <span className="section-tagline">Industrial Metrology & Hand Finishing</span>
        <h2 className="section-h2">From Raw Specimen to the Savile Row Lapel.</h2>
        <p className="section-lead">
          Our manufacturing protocol balances high-speed automated blank punching with hand-calibrated diamond lathe shaping and 72-hour walnut shell tumbling.
        </p>
      </div>

      {/* Auto-cycle timeline scrub bar */}
      <div className="process-autoplay-bar">
        <button
          type="button"
          className="autoplay-toggle-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause automated walkthrough' : 'Start automated walkthrough'}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          <span>{isPlaying ? 'Pause Tour' : 'Autoplay Tour'}</span>
        </button>

        <div className="timeline-progress-track">
          <div
            className="timeline-progress-fill"
            style={{ width: isPlaying ? `${progress}%` : `${((activeStep + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
          Stage {activeStep + 1} of {STAGES.length}
        </span>
      </div>

      <div className="process-interactive-wrapper">
        {/* Interactive Step Selector Buttons */}
        <div className="process-nav-list" role="tablist" aria-label="Manufacturing Stages">
          {STAGES.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <button
                key={s.num}
                type="button"
                className={`process-step-btn ${activeStep === idx ? 'active' : ''}`}
                role="tab"
                aria-selected={activeStep === idx}
                data-step={idx}
                onClick={() => handleStepClick(idx)}
              >
                <span className="step-number">{s.num}</span>
                <div className="step-details" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IconComp size={14} strokeWidth={2} style={{ opacity: activeStep === idx ? 1 : 0.6 }} />
                    <h4>{s.heading}</h4>
                  </div>
                  <p>{s.sub}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Process Visual Stage */}
        <div className="process-stage-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.num}
              initial={{ opacity: 0.6, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.6, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            >
              <Image
                src={current.img}
                alt={current.title}
                width={800}
                height={500}
                id="process-stage-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="process-stage-overlay" style={{ zIndex: 5 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="process-stage-title" id="process-stage-title">
                  {current.title}
                </h3>
                <p className="process-stage-desc" id="process-stage-desc">
                  {current.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
