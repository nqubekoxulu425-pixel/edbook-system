import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsTab from './ProjectsTab';
import TeamsTab from './TeamsTab';
import InboxTab from './InboxTab';
import SettingsTab from './SettingsTab';
import { 
  Megaphone, 
  FolderKanban, 
  Users, 
  Mail, 
  Settings as SettingsIcon, 
  LogOut, 
  UserCircle 
} from 'lucide-react';

function Dashboard({ user, setUser }) {
  // Keeps track of which tab button is active
  const [activeTab, setActiveTab] = useState('announcements');
  const navigate = useNavigate();

  // Simple logout procedure
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Helper functions to simulate the visual content blocks for now
  const renderTabContent = () => {
    switch (activeTab) {
      case 'announcements':
        return (
          <div>
            <h2>Announcements Feed</h2>
            <p style={{ color: 'var(--text-muted)' }}>Important communication updates for the EdBook workspace team.</p>
            <div className="announcement-grid">
              <div className="announcement-card">
                <h3>General Overview Notice</h3>
                <p style={{ marginTop: '0.5rem' }}>Welcome to the brand new centralized EdBook Project Management platform. Use the sidebar layout to keep tabs on deadlines, teams, and communication lines.</p>
              </div>
              <div className="steam-panel">
                <h3>STEAM Feeds</h3>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#166534' }}>Any announcements about Science, Technology, Engineering, Arts, and Mathematics (STEAM) will safely output in this side module.</p>
              </div>
            </div>
          </div>
        );
      case 'projects':
        return <ProjectsTab user={user} />;
      case 'teams':
        return <TeamsTab user={user} />;
       case 'inbox':
     return <InboxTab user={user} />;
   case 'settings':
     return <SettingsTab user={user} />;
      default:
        return <h2>System Route Exception</h2>;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* 1. LEFT SIDEBAR COMPONENT */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', color: '#f8fafc', letterSpacing: '0.5px' }}>EdBook System</h1>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button 
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: activeTab === 'announcements' ? 'var(--primary)' : 'transparent', textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => setActiveTab('announcements')}
            >
              <Megaphone size={18} /> Announcements
            </button>

            <button 
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: activeTab === 'projects' ? 'var(--primary)' : 'transparent', textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => setActiveTab('projects')}
            >
              <FolderKanban size={18} /> My Projects
            </button>

            <button 
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: activeTab === 'teams' ? 'var(--primary)' : 'transparent', textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => setActiveTab('teams')}
            >
              <Users size={18} /> My Teams
            </button>

            <button 
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: activeTab === 'inbox' ? 'var(--primary)' : 'transparent', textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => setActiveTab('inbox')}
            >
              <Mail size={18} /> Inbox
            </button>

            <button 
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: activeTab === 'settings' ? 'var(--primary)' : 'transparent', textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon size={18} /> Settings
            </button>
          </nav>
        </div>

        {/* LOGOUT CONTROL MODULE BLOCK */}
        <button 
          className="btn" 
          style={{ background: '#334155', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}
          onClick={handleLogout}
        >
          <LogOut size={18} /> Exit Session
        </button>
      </aside>

      {/* 2. MAIN HUB WORKSPACE LAYOUT */}
      <main className="main-content">
        {/* UPPER BANNER LAYOUT */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div>
            <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 'bold', color: 'var(--primary)' }}>Workspace Workspace Hub</span>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>Welcome Back, {user?.name}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e2e8f0', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
            <UserCircle size={16} />
            <span style={{ textTransform: 'capitalize' }}>{user?.role} Mode</span>
          </div>
        </header>

        {/* INJECTED TARGET PAGE INTERFACE BLOCK */}
        <section style={{ background: 'var(--card)', padding: '2rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
          {renderTabContent()}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
