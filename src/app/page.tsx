'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Box, ShieldCheck, PhoneCall } from 'lucide-react';
import ThreeStudio from '@/components/ThreeStudio';
import MaterialsArchive from '@/components/MaterialsArchive';
import ManufacturingProcess from '@/components/ManufacturingProcess';
import VolumeCalculator from '@/components/VolumeCalculator';
import CertificationsBanner from '@/components/CertificationsBanner';
import SwatchModal from '@/components/SwatchModal';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudioMaterial, setSelectedStudioMaterial] = useState<string>('nacre');

  return (
    <>
      {/* Top Notice Bar */}
      <div className="top-notice-bar">
        <div className="notice-group">
          <span>Est. 1928 · Biella · Milan · London · Jaipur</span>
          <span className="badge-tag">OEKO-TEX® CLASS 1</span>
        </div>
        <div className="notice-group">
          <span>GRS Recycled & CITES Certified</span>
          <span>·</span>
          <span>Complimentary Atelier Swatch Boxes Dispatched Globally</span>
        </div>
      </div>

      {/* Sticky Site Header */}
      <header className="site-header" role="banner">
        <div className="brand-block">
          <a href="#" className="brand-name">Bottonificio 1928</a>
          <span className="brand-origin">Atelier & Manufacture</span>
        </div>

        <nav className="main-nav" role="navigation" aria-label="Main Navigation">
          <a href="#studio-section" className="nav-link">3D Studio</a>
          <a href="#materials-section" className="nav-link">Material Archive</a>
          <a href="#process-section" className="nav-link">5-Stage Craft</a>
          <a href="#calculator-section" className="nav-link">Volume & MOQ</a>
          <a href="#compliance-section" className="nav-link">Certifications</a>
        </nav>

        <div className="header-cta-group">
          <button
            type="button"
            className="btn-outline btn-open-swatch-modal"
            id="header-sample-btn"
            onClick={() => setModalOpen(true)}
          >
            Request Swatch Box
          </button>
          <a href="#calculator-section" className="btn-primary" id="header-quote-btn">
            Instant Quote
          </a>
        </div>
      </header>

      <main role="main">
        {/* Hero Section: Split-Stage Architecture */}
        <section className="hero-stage" id="studio-section">
          {/* Left Column: Editorial Manifesto & Value Propositions */}
          <motion.div
            className="hero-editorial"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="atelier-badge-row">
              <span>Three Generations of Precision Turning</span>
              <div className="line-divider"></div>
              <span>Savile Row & Haute Couture Standard</span>
            </div>

            <h1 className="hero-title">
              Fastening the World&apos;s <em>Finest Garments</em> Since 1928.
            </h1>

            <p className="hero-lead">
              From cold-pressed Ecuadorian corozo nuts and marbled water buffalo horn to hand-harvested Australian nacre and plant-derived bio-resins. We marry heritage Italian lathe turning with diamond-tolerance industrial volume.
            </p>

            <div className="hero-features-strip">
              <div className="strip-item">
                <h4>Bespoke & Industrial</h4>
                <p>From 50-piece couture runs to 500,000-piece international collections.</p>
              </div>
              <div className="strip-item">
                <h4>In-House Spectrometry</h4>
                <p>100% exact dye matching to any Pantone or bespoke fabric swatch.</p>
              </div>
              <div className="strip-item">
                <h4>Zero-Microplastic Resin</h4>
                <p>78% bio-cast polymers derived from renewable agricultural monomers.</p>
              </div>
            </div>

            <div className="hero-actions">
              <motion.button
                type="button"
                className="btn-primary btn-open-swatch-modal"
                id="hero-sample-cta"
                onClick={() => setModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Request Swatch Box</span>
                <span className="btn-nested-icon">
                  <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              </motion.button>
              <a href="#materials-section" className="btn-outline" id="hero-archive-cta">
                Explore Material Archive
              </a>
            </div>

            <div className="hero-caption">
              <span className="status-dot"></span>
              <span>Atelier Active · 24 High-Speed CNC Lathes Running · Batch Quality Tested ISO 9001</span>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Atelier Studio */}
          <ThreeStudio
            selectedMaterial={selectedStudioMaterial}
            onMaterialChange={setSelectedStudioMaterial}
          />
        </section>

        {/* Material Specimen Archive with bidirectional 3D studio connection */}
        <MaterialsArchive onSelectMaterial={setSelectedStudioMaterial} />

        {/* Visual Interlude: Italian Lathe Craftsmanship */}
        <section className="section workshop-interlude">
          <div className="interlude-grid">
            <div className="interlude-media">
              <div className="image-frame">
                <Image
                  src="/assets/factory_lathe.jpg"
                  alt="Italian Bianchi precision lathe turning button blanks"
                  width={800}
                  height={500}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <span className="image-caption">Atelier Bay 04 · Automated Bianchi PCD lathe turning Tagua corozo blanks at 2,400 RPM</span>
              </div>
            </div>

            <div className="interlude-text">
              <span className="section-eyebrow">Precision Engineering</span>
              <h2 className="interlude-title">Diamond-Cut Tolerances for the Global Luxury Industry</h2>
              <p className="interlude-desc">
                Button holes that shred thread under industrial sewing machines are unacceptable. Every Bottonificio aperture is cut with diamond micro-reamers and countersunk to eliminate sharp edges, ensuring effortless automatic button-sewing on Juki and Brother factory lines.
              </p>
              <div className="interlude-stats">
                <div className="interlude-stat">
                  <span className="interlude-stat-num">±0.02mm</span>
                  <span className="interlude-stat-label">Diameter Tolerance</span>
                </div>
                <div className="interlude-stat">
                  <span className="interlude-stat-num">1.4s</span>
                  <span className="interlude-stat-label">Cycle Time / Unit</span>
                </div>
                <div className="interlude-stat">
                  <span className="interlude-stat-num">0%</span>
                  <span className="interlude-stat-label">Formaldehyde or Petro-Glaze</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5-Stage Manufacturing Journey */}
        <ManufacturingProcess />

        {/* Volume & MOQ Calculator */}
        <VolumeCalculator onOpenModal={() => setModalOpen(true)} />

        {/* Certifications & Quality Accreditations */}
        <CertificationsBanner />

        {/* Final CTA Strip */}
        <section className="section cta-strip-section">
          <div className="cta-strip-card">
            <span className="section-eyebrow light">Tailored Consultation</span>
            <h2 className="cta-strip-title">Curate Your Season&apos;s Button Identity</h2>
            <p className="cta-strip-desc">
              Speak directly with our master turners and color laboratory technicians. Custom mold fabrication, dye recipe development, and pre-production proofs dispatched in 72 hours.
            </p>
            <div className="cta-strip-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setModalOpen(true)}
              >
                <span>Order Atelier Swatch Box</span>
                <span className="btn-nested-icon">
                  <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              </button>
              <a href="#calculator-section" className="btn btn-outline light">
                Calculate Commercial Volume
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Site Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-top-grid">
          <div className="footer-brand">
            <h3>Bottonificio 1928</h3>
            <p>Bespoke couture atelier and industrial precision button manufacturer serving luxury houses across London, Milan, Paris, and Tokyo.</p>
            <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-brass)' }}>
              ISO 9001:2015 · ISO 14001:2015 · OEKO-TEX Standard 100
            </p>
          </div>

          <div className="footer-col">
            <h4>Material Archives</h4>
            <ul className="footer-links">
              <li><a href="#materials-section">Ecuadorian Corozo</a></li>
              <li><a href="#materials-section">Smoked Buffalo Horn</a></li>
              <li><a href="#materials-section">Australian Mother-of-Pearl</a></li>
              <li><a href="#materials-section">Bio-Cast Emerald Resin</a></li>
              <li><a href="#materials-section">Ocean Recycled Terrazzo</a></li>
              <li><a href="#materials-section">Vintage Lathe Brass</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Atelier Locations</h4>
            <ul className="footer-links">
              <li><strong>Biella Manufacture:</strong> Via Milano 42, 13900 Biella (BI), Italy</li>
              <li><strong>Milan Showroom:</strong> Via Montenapoleone 18, 20121 Milano</li>
              <li><strong>London Atelier:</strong> 28 Savile Row, Mayfair, London W1S 2EU</li>
              <li><strong>Email:</strong> atelier@bottonificio1928.com</li>
              <li><strong>Direct:</strong> +39 015 849 2038</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Complimentary Box</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-light-muted)', marginBottom: '16px' }}>
              Fashion designers and tailoring houses receive our physical hand-bound archival sample portfolio box without charge.
            </p>
            <button
              type="button"
              className="btn-brass btn-open-swatch-modal"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setModalOpen(true)}
            >
              Request Portfolio Box
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 1928–2026 Bottonificio 1928 S.r.l. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Made with Italian Craft & Precision Metrology</span>
            <span>London · Milan · Biella</span>
          </div>
        </div>
      </footer>

      {/* Swatch Request Modal */}
      <SwatchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
