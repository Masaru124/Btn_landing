'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Eye } from 'lucide-react';

interface MaterialsArchiveProps {
  onSelectMaterial?: (mat: string) => void;
}

const SPECIMENS = [
  {
    code: 'CZ-284',
    studioKey: 'corozo',
    name: 'Ecuadorian Corozo Nut',
    tag: 'Vegetable Ivory',
    latin: 'Phytelephas macrocarpa · Ecuador',
    img: '/assets/materials_archive.jpg',
    desc: 'Harvested only after falling naturally from the Tagua palm tree. Dense, rock-hard cellulose that accepts deep organic dyes into its microscopic pores, yielding warm, rich, luminous textures unmatched by synthetic polymers.',
    attr1Key: 'Hardness',
    attr1Val: 'Shore D 86',
    attr2Key: 'Recommended For',
    attr2Val: 'Suiting, Overcoats, Chinos'
  },
  {
    code: 'HN-891',
    studioKey: 'horn',
    name: 'Smoked Buffalo Horn',
    tag: 'Natural Keratin',
    latin: 'Bubalus bubalis · Ethical Byproduct',
    img: '/assets/hero_craft.jpg',
    desc: 'Turned from uncalcified solid horn tips with natural swirling veins of amber, honey, and charcoal black. No two buttons share identical grain. Flame-buffed to achieve an enduring, tactile eggshell luster.',
    attr1Key: 'Hardness',
    attr1Val: 'Shore D 92',
    attr2Key: 'Recommended For',
    attr2Val: 'Savile Row Tuxedos, Blazers'
  },
  {
    code: 'MP-042',
    studioKey: 'nacre',
    name: 'Australian Mother-of-Pearl',
    tag: 'Marine Nacre',
    latin: 'Pinctada maxima · South Seas',
    img: '/assets/materials_archive.jpg',
    desc: 'Sourced from mature South Sea oyster shells following pearl extraction. Deep prismatic nacre layers scatter ambient light into subtle rainbow highlights. Hand-split to preserve structural tensile strength.',
    attr1Key: 'Hardness',
    attr1Val: 'Mohs 3.5',
    attr2Key: 'Recommended For',
    attr2Val: 'Dress Shirts, Silk Blouses'
  },
  {
    code: 'BR-703',
    studioKey: 'brass',
    name: 'Burnished Vintage Brass',
    tag: 'Solid Alloy',
    latin: 'CuZn39Pb3 · 100% Recycled Metal',
    img: '/assets/factory_lathe.jpg',
    desc: 'Solid billet brass turned on dual-axis Italian lathes. Treated with organic tumbling wax and sulfur patination to recreate the heirloom warmth of century-old naval and military blazer buttons.',
    attr1Key: 'Tensile Strength',
    attr1Val: '420 MPa',
    attr2Key: 'Recommended For',
    attr2Val: 'Peacoats, Denim, Outerwear'
  },
  {
    code: 'BC-519',
    studioKey: 'resin',
    name: 'Bio-Cast Botanical Resin',
    tag: 'Plant Monomers',
    latin: '78% Plant-Derived · Bio-Circular',
    img: '/assets/hero_craft.jpg',
    desc: 'Formulated with non-food agricultural castor and flaxseed monomers. Offers flawless clarity, UV stability, and complete resilience against commercial dry cleaning solvents without petroleum dependency.',
    attr1Key: 'Bio-Content',
    attr1Val: '78.4% ASTM D6866',
    attr2Key: 'Recommended For',
    attr2Val: 'Contemporary Ready-to-Wear'
  },
  {
    code: 'TZ-116',
    studioKey: 'terrazzo',
    name: 'Ocean Recycled Terrazzo',
    tag: 'GRS Certified',
    latin: 'Upcycled Marine Debris · GRS 4.0',
    img: '/assets/factory_lathe.jpg',
    desc: 'Created by fusing recovered Mediterranean fishing nets with recycled polyester. Each button features an organic, architectural speckling with high tensile resilience and a silky matte finish.',
    attr1Key: 'Recycled Ratio',
    attr1Val: '100% Post-Consumer',
    attr2Key: 'Recommended For',
    attr2Val: 'Knitwear, Workwear, Casual'
  }
];

export default function MaterialsArchive({ onSelectMaterial }: MaterialsArchiveProps) {
  const handleInspect = (studioKey: string) => {
    if (onSelectMaterial) {
      onSelectMaterial(studioKey);
    }
    const studioEl = document.getElementById('studio-section');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="materials-section" id="materials-section">
      <span id="materials" style={{ display: 'none' }}></span>
      <div className="section-head-editorial">
        <span className="section-tagline">Raw Sourcing & Specimen Provenance</span>
        <h2 className="section-h2">The Organic Archive: Natural Specimens Reimagined.</h2>
        <p className="section-lead">
          Every raw material we machine has an ethical pedigree. We reject imitation plastics in favor of biodegradable vegetable ivory, sustainably farmed buffalo horn, marine nacre shells, and bio-cast polymers that degrade harmlessly at garment end-of-life.
        </p>
      </div>

      <div className="specimen-grid">
        {SPECIMENS.map((spec, idx) => (
          <motion.article
            className="specimen-card"
            key={spec.code}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="specimen-header-visual">
              <Image
                src={spec.img}
                alt={spec.name}
                width={400}
                height={220}
                className="specimen-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span className="specimen-tag">{spec.tag}</span>
            </div>
            <div className="specimen-body">
              <span className="specimen-latin">{spec.latin}</span>
              <h3 className="specimen-title">{spec.name}</h3>
              <p className="specimen-desc">{spec.desc}</p>
              <div className="specimen-attributes">
                <div>
                  <span className="attr-key">{spec.attr1Key}</span>
                  <span className="attr-val">{spec.attr1Val}</span>
                </div>
                <div>
                  <span className="attr-key">{spec.attr2Key}</span>
                  <span className="attr-val">{spec.attr2Val}</span>
                </div>
              </div>

              {/* Interactive Inspect Button */}
              <button
                type="button"
                className="btn-card-inspect"
                onClick={() => handleInspect(spec.studioKey)}
                aria-label={`Inspect ${spec.name} in 3D Atelier Studio`}
              >
                <span>Inspect in 3D Studio</span>
                <span className="inspect-icon">
                  <ArrowUpRight size={13} strokeWidth={2.5} />
                </span>
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
