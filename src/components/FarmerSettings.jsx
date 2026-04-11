import React, { useState } from 'react';
import { Save, User, MapPin, Phone, Shield } from 'lucide-react';

export default function FarmerSettings() {
  const [saved, setSaved] = useState(false);
  const [phone, setPhone] = useState(localStorage.getItem('farmerPhone') || '+91 9988776655');

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('farmerPhone', phone);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ flex: 1, animation: 'fadeIn 0.3s ease' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Administrator Settings</h1>
      
      <div className="panel-card" style={{ maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User /> Local Farm Information
        </h2>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Primary Owner Name</label>
              <input type="text" defaultValue="Arjun Reddy" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-low)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Contact Number (SMS Alerts)</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: '8px', padding: '0 0.75rem' }}>
                <Phone size={16} className="text-muted" />
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                  style={{ border: 'none', background: 'transparent', padding: '0.75rem', width: '100%', outline: 'none' }} 
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Field Address / Region</label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: '8px', padding: '0 0.75rem' }}>
                <MapPin size={16} className="text-muted" />
                <input type="text" defaultValue="Sector 04, Northern Perimeter, TN" required style={{ border: 'none', background: 'transparent', padding: '0.75rem', width: '100%', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Farm Plot Size (Acres)</label>
              <input type="number" defaultValue="14" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-container-low)' }} />
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--primary-container)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Shield className="text-primary" size={24} />
            <div>
              <p style={{ fontWeight: 600, color: 'var(--primary)' }}>Secure Access Validation</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>These details map directly to the automated emergency dispatch logic when bio-threats are detected.</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
             <button type="submit" className="btn primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Save size={18} /> {saved ? 'Details Secured!' : 'Save Configuration'}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}
