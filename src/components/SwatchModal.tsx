'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Send } from 'lucide-react';

export default function SwatchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    house: '',
    volume: '2,500 – 10,000 pcs (Seasonal Line)',
    address: '',
    materials: ['Corozo', 'Horn', 'Nacre']
  });

  const handleCheckbox = (mat: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(mat)
        ? prev.materials.filter(m => m !== mat)
        : [...prev.materials, mat]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop active"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="modal-drawer"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">Complimentary Dispatch</span>
                <h3 className="modal-title">Request Curated Atelier Swatch Box</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-desc">
                Shipped complimentary to tailored menswear brands, couture houses, and garment procurement teams. Contains 24 turned buttons spanning Corozo, Horn, Nacre, Brass, Bio-Resin, and Terrazzo across 18L to 44L calibers.
              </p>

              {submitted ? (
                <motion.div
                  className="submit-success-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: '36px 24px',
                    textAlign: 'center',
                    background: '#EAE6DC',
                    borderRadius: '8px',
                    border: '1px solid var(--accent-brass)'
                  }}
                >
                  <CheckCircle2 size={40} color="var(--accent-brass)" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '8px' }}>
                    Swatch Box Dispatched
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)' }}>
                    Thank you, {formData.name || 'Valued Partner'}. Your tracking number and laboratory specimen dossier will be emailed to {formData.email || 'your email'} shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="swatch-form">
                  <div className="form-row-dual">
                    <div className="form-group">
                      <label className="form-label" htmlFor="swatch-name">Your Name</label>
                      <input
                        type="text"
                        id="swatch-name"
                        required
                        placeholder="e.g. Alistair Sterling"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="swatch-email">Professional Email</label>
                      <input
                        type="email"
                        id="swatch-email"
                        required
                        placeholder="atelier@yourbrand.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-dual">
                    <div className="form-group">
                      <label className="form-label" htmlFor="swatch-house">Fashion House / Brand</label>
                      <input
                        type="text"
                        id="swatch-house"
                        placeholder="Savile Row Atelier or Brand"
                        value={formData.house}
                        onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="swatch-volume">Annual Button Requirement</label>
                      <select
                        id="swatch-volume"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      >
                        <option value="50 – 500 pcs (Bespoke / Couture)">50 – 500 pcs (Bespoke / Couture)</option>
                        <option value="500 – 2,500 pcs (Capsule Drop)">500 – 2,500 pcs (Capsule Drop)</option>
                        <option value="2,500 – 10,000 pcs (Seasonal Line)">2,500 – 10,000 pcs (Seasonal Line)</option>
                        <option value="10,000 – 50,000 pcs (Wholesale)">10,000 – 50,000 pcs (Wholesale)</option>
                        <option value="50,000+ pcs (Enterprise Fleet)">50,000+ pcs (Enterprise Fleet)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority Specimen Focus</label>
                    <div className="form-checkbox-row">
                      {['Corozo', 'Horn', 'Nacre', 'Brass', 'Bio-Resin', 'Terrazzo'].map((mat) => (
                        <label key={mat} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.materials.includes(mat)}
                            onChange={() => handleCheckbox(mat)}
                          />
                          <span>{mat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="swatch-address">Shipping Address & Country</label>
                    <textarea
                      id="swatch-address"
                      rows={3}
                      required
                      placeholder="Studio address for DHL express dispatch"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-block">
                      <span>Dispatch Complimentary Swatch Box</span>
                      <Send size={14} style={{ marginLeft: '8px' }} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
