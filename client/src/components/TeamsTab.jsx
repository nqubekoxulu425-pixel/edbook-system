import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, ShieldAlert, Users } from 'lucide-react';

function TeamsTab({ user }) {
  // Central Functional Application States
  const [teams, setTeams] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // 1. DYNAMIC SYSTEM LOAD DATABASE FETCH
  const fetchTeamsData = async () => {
    try {
      const response = await fetch('https://edbook-system.onrender.com/api/teams');
      const data = await response.json();
      if (response.ok) {
        setTeams(data);
      }
    } catch (err) {
      console.error("Error connecting to teams schema database endpoints:", err);
    }
  };

  useEffect(() => {
    fetchTeamsData();
    // Helper check initialization: If database has zero teams, load two structural default teams
    const initDefaultTeams = async () => {
      try {
        const check = await fetch('https://edbook-system.onrender.com/api/teams');
        const existingData = await check.json();
        if (existingData.length === 0) {
          await fetch('https://edbook-system.onrender.com/api/teams/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName: 'EdBook Core STEAM Team A', managerId: user.id })
          });
          await fetch('https://edbook-system.onrender.com/api/teams/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName: 'EdBook Development Group B', managerId: user.id })
          });
          fetchTeamsData();
        }
      } catch (e) { console.log(e); }
    };
    initDefaultTeams();
  }, []);

  // 2. DISPATCH JOIN REQUEST ROUTER SYSTEM
  const handleRequestJoin = async (teamId) => {
    setStatusMessage('');
    try {
      const response = await fetch(`https://edbook-system.onrender.com/api/teams/${teamId}/request-join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await response.json();
      setStatusMessage(data.message);
      fetchTeamsData(); // Sync live request queues view
    } catch (err) {
      setStatusMessage('Operational link transmission failure.');
    }
  };

  // 3. RESOLVE PENDING JOIN ACTION REQUEST (Manager Verification Control)
  const handleResolveRequest = async (teamId, targetUserId, approveBoolean) => {
    try {
      const response = await fetch(`https://edbook-system.onrender.com/api/teams/${teamId}/handle-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, approve: approveBoolean })
      });
      if (response.ok) {
        fetchTeamsData(); // Instantly update membership rows
      }
    } catch (err) {
      console.error("Error managing access queues token resolution:", err);
    }
  };
  return (
    <div>
      <h2>My Teams Directory Workspace</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Review team alignments, active colleagues, and system join operations.
      </p>

      {statusMessage && (
        <div style={{ padding: '10px', background: '#e0f2fe', color: '#0369a1', fontWeight: 'bold', borderRadius: '4px', marginBottom: '1rem' }}>
          {statusMessage}
        </div>
      )}

      {/* DASHBOARD JOIN REQUEST DISPLAY CARD (Visible layout depends on requirements profile) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {teams.map((team) => (
          <div key={team._id} style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text)' }}>{team.teamName}</h3>
              <Users size={18} style={{ color: 'var(--primary)' }} />
            </div>

            {/* A. REGISTERED WORKSPACE MEMBER LIST TRACK */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Active Workspace Members</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {team.members.length === 0 ? (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No members logged inside folder tree.</span>
                ) : (
                  team.members.map(m => (
                    <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                      <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                      <span>{m.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({m.email})</span></span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* B. STUDENT JOIN SUBMISSION CONTROLS AREA ROUTE */}
            {user.role === 'student' && (
              <button 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', background: '#0f172a' }}
                onClick={() => handleRequestJoin(team._id)}
              >
                <UserPlus size={16} /> Submit Join Authorization Request
              </button>
            )}

            {/* C. MANAGER EXCLUSIVE JOIN QUEUE OVERVIEW MODULE CONTROLS */}
            {user.role === 'manager' && (
              <div style={{ background: '#fff7ed', border: '1px dashed #fed7aa', padding: '10px', borderRadius: '6px', marginTop: '1rem' }}>
                <h5 style={{ color: '#c2410c', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <ShieldAlert size={14} /> Pending Dashboard Join Queue ({team.joinRequests?.length || 0})
                </h5>
                {team.joinRequests?.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#9a3412' }}>No incoming candidate tokens waiting for authorization.</p>
                ) : (
                  team.joinRequests?.map(reqUser => (
                    <div key={reqUser._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ffedd5', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{reqUser.name}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button style={{ background: 'var(--success)', border: 'none', color: 'white', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem' }} onClick={() => handleResolveRequest(team._id, reqUser._id, true)}>
                          Accept
                        </button>
                        <button style={{ background: 'var(--danger)', border: 'none', color: 'white', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.75rem' }} onClick={() => handleResolveRequest(team._id, reqUser._id, false)}>
                          Deny
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamsTab;
