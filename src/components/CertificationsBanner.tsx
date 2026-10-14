'use client';

import React from 'react';

const CERTS = [
  {
    code: 'STANDARD 100 · APPENDIX 6',
    title: 'OEKO-TEX® Class 1 Certified',
    desc: 'Tested free from over 300 harmful substances. Certified 100% skin-safe for luxury babywear, intimate apparel, and sensitive next-to-skin tailoring.'
  },
  {
    code: 'GRS 4.0 · TE-00049281',
    title: 'Global Recycled Standard',
    desc: 'Third-party audited chain of custody verifying recycled post-consumer PET content and fair labor conditions across our polymer recycling plant.'
  },
  {
    code: 'CITES CONVENTION APPENDIX II',
    title: 'Legal Wildlife Compliance',
    desc: 'Natural horn and bone buttons harvested strictly as regulated agricultural byproducts with full veterinary health and non-endangered CITES export certificates.'
  },
  {
    code: 'EC NO 1907/2006',
    title: 'EU REACH Compliance',
    desc: 'Exceeds all European Union chemical safety benchmarks. Zero nickel discharge, zero lead release, and 100% phthalate-free formulation.'
  }
];

export default function CertificationsBanner() {
  return (
    <section className="compliance-section" id="compliance-section">
      <span id="certifications" style={{ display: 'none' }}></span>
      <div className="section-head-editorial">
        <span className="section-tagline">Compliance & Laboratory Audits</span>
        <h2 className="section-h2">Certified by European & Global Standards.</h2>
        <p className="section-lead">
          Our products undergo strict laboratory testing for heavy metals, formaldehydes, azo dyes, and tensile fracture limits to ensure complete safety and international export readiness.
        </p>
      </div>

      <div className="cert-grid">
        {CERTS.map((c, idx) => (
          <div className="cert-card" key={idx}>
            <span className="cert-code">{c.code}</span>
            <h4 className="cert-title">{c.title}</h4>
            <p className="cert-desc">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
