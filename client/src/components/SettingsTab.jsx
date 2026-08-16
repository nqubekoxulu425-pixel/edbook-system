import React, { useState } from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';

function SettingsTab({ user }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState({ text: '', isError: false });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setFeedback({ text: '', isError: false });

    try {
      const response = await fetch('https://edbook-system.onrender.com/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, oldPassword, newPassword })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setFeedback({ text: '🎉 ' + data.message, isError: false });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setFeedback({ text: '❌ Error: ' + err.message, isError: true });
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto' }}>
      <h2>Account Profile Configurations</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Modify your system configuration keys. Note: Profile URL variables have been purged from database tables.
      </p>

      {feedback.text && (
        <div style={{ padding: '10px', background: feedback.isError ? '#fef2f2' : '#f0fdf4', color: feedback.isError ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {feedback.text}
        </div>
      )}

      {/* SYSTEM ALTERATION INTERFACE */}
      <form onSubmit={handleChangePassword} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem', color: 'var(--text)' }}>
          <KeyRound size={18} style={{ color: 'var(--primary)' }} /> Modify Security Passcode
        </h4>
        
        <div className="form-group">
          <label style={{ fontSize: '0.85rem' }}>Current Account Password</label>
          <input type="password" className="form-control" style={{ padding: '0.6rem' }} required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>

        <div className="form-group">
          <label style={{ fontSize: '0.85rem' }}>Configured New Password Override</label>
          <input type="password" className="form-control" style={{ padding: '0.6rem' }} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>

        <button type="submit" className="btn" style={{ padding: '0.6rem', marginTop: '0.5rem' }}>
          Execute Passcode Modification
        </button>
      </form>
    </div>
  );
}

export default SettingsTab;
