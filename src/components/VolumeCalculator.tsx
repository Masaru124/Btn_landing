'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';

interface VolumeCalculatorProps {
  onOpenModal?: () => void;
}

const MATERIAL_BASE_PRICES: Record<string, number> = {
  nacre: 1.65,
  corozo: 0.95,
  horn: 1.45,
  brass: 1.25,
  resin: 0.75,
  terrazzo: 0.85
};

const PRESETS = [
  { label: '50 pcs (Couture)', qty: 50, tier: 'bespoke' as const },
  { label: '500 pcs (Capsule)', qty: 500, tier: 'studio' as const },
  { label: '2,500 pcs (Seasonal)', qty: 2500, tier: 'studio' as const },
  { label: '25,000 pcs (Fleet)', qty: 25000, tier: 'enterprise' as const },
];

export default function VolumeCalculator({ onOpenModal }: VolumeCalculatorProps) {
  const [tier, setTier] = useState<'bespoke' | 'studio' | 'enterprise'>('studio');
  const [material, setMaterial] = useState<string>('horn');
  const [finish, setFinish] = useState<string>('matte');
  const [quantity, setQuantity] = useState<number>(2500);

  // Compute tier discounts
  let discountMultiplier = 0.65;
  let leadTimeText = 'Estimated Dispatch: 7–10 Working Days';
  let moqNotice = 'Tier MOQ: 500 pieces';

  if (tier === 'bespoke') {
    discountMultiplier = 1.0;
    leadTimeText = 'Estimated Dispatch: 3–5 Working Days';
    moqNotice = 'Tier MOQ: 50 pieces minimum';
  } else if (tier === 'enterprise') {
    discountMultiplier = 0.35;
    leadTimeText = 'Estimated Dispatch: 14–21 Working Days (Call-off available)';
    moqNotice = 'Tier MOQ: 10,000 pieces';
  }

  const basePrice = MATERIAL_BASE_PRICES[material] || 1.0;
  const finishMultiplier = finish === 'laser' ? 1.15 : 1.0;
  const unitCostNum = basePrice * discountMultiplier * finishMultiplier;
  const unitPriceFormatted = `£${unitCostNum.toFixed(2)} / pc`;
  const totalBatchPriceFormatted = `£${(unitCostNum * quantity).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleTierSelect = (selectedTier: 'bespoke' | 'studio' | 'enterprise') => {
    setTier(selectedTier);
    if (selectedTier === 'bespoke' && quantity > 500) setQuantity(250);
    if (selectedTier === 'studio' && (quantity < 500 || quantity > 10000)) setQuantity(250);
    if (selectedTier === 'enterprise' && quantity < 10000) setQuantity(25000);
  };

  const handlePresetClick = (presetQty: number, presetTier: 'bespoke' | 'studio' | 'enterprise') => {
    setTier(presetTier);
    setQuantity(presetQty);
  };

  return (
    <section className="calculator-section" id="calculator-section">
      <span id="calculator" style={{ display: 'none' }}></span>
      <div className="section-head-editorial" style={{ margin: '0 auto', textAlign: 'center' }}>
        <span className="section-tagline">Real-Time Specification & Pricing Engine</span>
        <h2 className="section-h2">Configure Volume, Material & Lead Time.</h2>
        <p className="section-lead">
          Whether you need 100 buttons for bespoke hand tailoring or 250,000 buttons for global luxury ready-to-wear production, our transparent tiered quoting provides immediate certainty.
        </p>
      </div>

      <div className="calc-card-container">
        {/* Form Controls Side */}
        <div className="calc-form-side">
          <div>
            <span className="form-group-title">1. Select Production Tier</span>
            <div className="volume-tier-grid">
              <motion.div
                className={`tier-card ${tier === 'bespoke' ? 'active' : ''}`}
                data-tier="bespoke"
                style={{ cursor: 'pointer' }}
                onClick={() => handleTierSelect('bespoke')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tier-name">Bespoke Atelier</span>
                <span className="tier-qty">50 – 500 pcs</span>
              </motion.div>
              <motion.div
                className={`tier-card ${tier === 'studio' ? 'active' : ''}`}
                data-tier="studio"
                style={{ cursor: 'pointer' }}
                onClick={() => handleTierSelect('studio')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tier-name">Designer RTW</span>
                <span className="tier-qty">500 – 5,000 pcs</span>
              </motion.div>
              <motion.div
                className={`tier-card ${tier === 'enterprise' ? 'active' : ''}`}
                data-tier="enterprise"
                style={{ cursor: 'pointer' }}
                onClick={() => handleTierSelect('enterprise')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tier-name">Global Fashion</span>
                <span className="tier-qty">10,000+ pcs</span>
              </motion.div>
            </div>
          </div>

          <div className="calc-select-grid">
            <div>
              <label htmlFor="calc-material" className="form-group-title">2. Material Selection</label>
              <select
                id="calc-material"
                className="custom-select"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="nacre">Australian Mother-of-Pearl</option>
                <option value="corozo">Ecuadorian Corozo Nut</option>
                <option value="horn">Smoked Buffalo Horn</option>
                <option value="brass">Burnished Solid Brass</option>
                <option value="resin">Bio-Cast Botanical Resin</option>
                <option value="terrazzo">Ocean Recycled Terrazzo</option>
              </select>
            </div>

            <div>
              <label htmlFor="calc-finish" className="form-group-title">3. Surface Finish</label>
              <select
                id="calc-finish"
                className="custom-select"
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
              >
                <option value="matte">Silky Walnut Matte</option>
                <option value="gloss">High-Gloss Nacre Luster</option>
                <option value="laser">Precision Laser Engraved</option>
                <option value="vintage">Burnished Vintage Patina</option>
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="calc-qty-input" className="form-group-title">4. Exact Quantity Required</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-teal)' }}>
                {quantity.toLocaleString()} pieces
              </span>
            </div>

            <input
              type="number"
              id="calc-qty-input"
              className="custom-select"
              value={quantity}
              min="50"
              step="50"
              placeholder="Enter number of pieces"
              onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value, 10) || 50))}
            />

            {/* Quick Presets Row */}
            <div className="volume-presets-row">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={`preset-chip ${quantity === p.qty ? 'active' : ''}`}
                  onClick={() => handlePresetClick(p.qty, p.tier)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <span
              id="calc-moq-notice"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--ink-muted)',
                marginTop: '8px',
                display: 'block'
              }}
            >
              {moqNotice}
            </span>
          </div>
        </div>

        {/* Live Estimate Summary Side */}
        <div className="calc-summary-side">
          <div>
            <h3 className="summary-heading">Commercial Breakdown</h3>
            <div className="summary-items-list">
              <div className="summary-row">
                <span className="label">Unit Price:</span>
                <span className="value" id="calc-unit-price">{unitPriceFormatted}</span>
              </div>
              <div className="summary-row">
                <span className="label">Spectrophotometer Dye:</span>
                <span className="value">Included (Pantone / Swatch)</span>
              </div>
              <div className="summary-row">
                <span className="label">Quality Standard:</span>
                <span className="value">OEKO-TEX Class 1</span>
              </div>
              <div className="summary-row">
                <span className="label">Sample Dispatch:</span>
                <span className="value">48 Hours</span>
              </div>
            </div>

            <div className="summary-price-box">
              <div className="estimated-price-label">Estimated Batch Total</div>
              <div className="estimated-price-val" id="calc-total-price">{totalBatchPriceFormatted}</div>
              <div className="estimated-lead-time" id="calc-lead-time">{leadTimeText}</div>
            </div>
          </div>

          <motion.button
            type="button"
            className="btn-primary btn-open-swatch-modal"
            style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}
            onClick={onOpenModal}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span>Submit Specification</span>
            <span className="btn-nested-icon">
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
