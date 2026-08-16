import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

function ProjectsTab({ user }) {
  // Application and Form States
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMethod, setSortMethod] = useState('recent');
  
  // Creation States (Manager View Only)
  const [manualId, setManualId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [formMessage, setFormMessage] = useState('');

  // Active Interactive Tracking Modal States
  const [activeProject, setActiveProject] = useState(null);
  const [commentText, setCommentText] = useState('');

  // 1. FETCH PROJECTS FROM DATABASE
  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/search?name=${searchQuery}&sort=${sortMethod}`);
      const data = await response.json();
      if (response.ok) setProjects(data);
    } catch (err) {
      console.error("Error fetching projects database: ", err);
    }
  };

  // Re-run database queries automatically whenever search text or sorting parameters change
  useEffect(() => {
    fetchProjects();
  }, [searchQuery, sortMethod]);

  // 2. CREATE A NEW PROJECT (Manager Action Route)
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manualProjectId: manualId,
          name: projectName,
          deadline,
          assignedTeam
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setFormMessage('🎉 Project loaded into tracking grid successfully!');
      setManualId('');
      setProjectName('');
      setDeadline('');
      setAssignedTeam('');
      fetchProjects(); // Instantly update view grid records
    } catch (err) {
      setFormMessage(`❌ Error: ${err.message}`);
    }
  };

  // 3. TRACK USER SESSION OPEN INTERACTION
  const openProjectModal = async (project) => {
    setActiveProject(project);
    try {
      await fetch(`http://localhost:5000/api/projects/${project._id}/log-interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.name, action: 'opened' })
      });
    } catch (err) {
      console.error("Interaction logging error:", err);
    }
  };

  // 4. TRACK USER SESSION CLOSE INTERACTION
  const closeProjectModal = async () => {
    if (!activeProject) return;
    try {
      await fetch(`http://localhost:5000/api/projects/${activeProject._id}/log-interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.name, action: 'closed' })
      });
    } catch (err) {
      console.error("Interaction logging error:", err);
    }
    setActiveProject(null);
    fetchProjects(); // Refresh timeline markers
  };

  // 5. POST COMMENT SUBMISSION
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${activeProject._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.name, text: commentText })
      });

      const data = await response.json();
      if (response.ok) {
        setActiveProject({ ...activeProject, comments: data.comments });
        setCommentText('');
      }
    } catch (err) {
      console.error("Comment delivery failure:", err);
    }
  };
  return (
    <div>
      {/* SECTION A: MANAGER UPLOAD INTERFACE GRID CONTROL PANEL */}
      {user.role === 'manager' && (
        <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px dashed #cbd5e1' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Control Console: Create/Upload Project Node</h3>
          {formMessage && <p style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem' }}>{formMessage}</p>}
          
          <form onSubmit={handleCreateProject} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Manual Project ID</label>
              <input type="text" className="form-control" style={{ padding: '0.5rem' }} required value={manualId} onChange={(e) => setManualId(e.target.value)} placeholder="e.g. EB-2026-X" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Project Title Name</label>
              <input type="text" className="form-control" style={{ padding: '0.5rem' }} required value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="App Development" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Assigned Core Team</label>
              <input type="text" className="form-control" style={{ padding: '0.5rem' }} required value={assignedTeam} onChange={(e) => setAssignedTeam(e.target.value)} placeholder="STEAM Team A" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Deadline Date Target</label>
              <input type="date" className="form-control" style={{ padding: '0.5rem' }} required value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <button type="submit" className="btn" style={{ padding: '0.6rem' }}>Publish Project Profile</button>
          </form>
        </div>
      )}

      {/* SECTION B: SEARCH ENGINE CONTROLS AND SORT DROPDOWNS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input type="text" className="form-control" style={{ paddingLeft: '2.5rem' }} placeholder="Filter entries using project names..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select className="form-control" style={{ width: 'auto', padding: '0.5rem' }} value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}>
            <option value="recent">Sort Option: Most Recent Uploads</option>
            <option value="nearest">Sort Option: Nearest Impending Deadline</option>
          </select>
        </div>
      </div>

      {/* SECTION C: THE DATA TABLE GRID */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Project ID</th>
            <th style={{ padding: '12px' }}>Project Title Name</th>
            <th style={{ padding: '12px' }}>Assigned Core Team</th>
            <th style={{ padding: '12px' }}>Imminent Deadline</th>
            <th style={{ padding: '12px' }}>Operational Status</th>
            <th style={{ padding: '12px' }}>Action Matrix</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No live records matched requirements criteria queries at this time.</td>
            </tr>
          ) : (
            projects.map((proj) => (
              <tr key={proj._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>{proj.manualProjectId}</td>
                <td style={{ padding: '12px' }}>{proj.name}</td>
                <td style={{ padding: '12px' }}><span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{proj.assignedTeam}</span></td>
                <td style={{ padding: '12px' }}>{new Date(proj.deadline).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  {proj.status === 'complete' ? (
                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}><CheckCircle size={16} /> Complete</span>
                  ) : (
                    <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}><XCircle size={16} /> Incomplete</span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="btn" style={{ padding: '5px 12px', fontSize: '0.85rem', width: 'auto' }} onClick={() => openProjectModal(proj)}>
                    Inspect Project Workspace
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* SECTION D: FLOATING MODAL INTERACTION DRAWER INTERFACE */}
      {activeProject && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '650px', borderRadius: '12px', padding: '2rem', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID String: {activeProject.manualProjectId}</span>
                <h2>{activeProject.name}</h2>
              </div>
              <button className="btn" style={{ background: '#ef4444', width: 'auto', height: 'fit-content', padding: '6px 14px' }} onClick={closeProjectModal}>X Close Workspace</button>
            </div>

            {/* Split layout block: Comments on Left side, Timestamp verification list stream logs on the Right side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}><MessageSquare size={16} /> Project Forum Thread</h4>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', height: '180px', overflowY: 'auto', border: '1px solid var(--border)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {activeProject.comments?.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No feedback comments logged on this module repository.</p>
                  ) : (
                    activeProject.comments?.map((c, i) => (
                      <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                        <strong>{c.user}</strong>: <span>{c.text}</span>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" className="form-control" style={{ padding: '0.5rem', fontSize: '0.9rem' }} placeholder="Type input comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
                  <button type="submit" className="btn" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Submit</button>
                </form>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}><Clock size={16} /> Active Session Timeline Logs</h4>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', height: '225px', overflowY: 'auto', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                  {activeProject.interactionLogs?.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No historical system interactions track elements detected.</p>
                  ) : (
                    activeProject.interactionLogs?.map((log, i) => (
                      <div key={i} style={{ marginBottom: '6px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '2px', color: log.action === 'opened' ? '#16a34a' : '#dc2626' }}>
                        <strong>{log.user}</strong> {log.action} this record file on {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsTab;
