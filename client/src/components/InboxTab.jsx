import React, { useState } from 'react';
import { Send, MessageSquareText } from 'lucide-react';

function InboxTab({ user }) {
  const [messages, setMessages] = useState([
    { sender: 'Manager Staff', text: 'Welcome to your private help desk. Drop any queries below.', time: '09:00 AM' }
  ]);
  const [textInput, setTextInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const newMsg = {
      sender: user.name,
      text: textInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setTextInput('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
        <MessageSquareText style={{ color: 'var(--primary)' }} /> Secure Manager Channel
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        {user.role === 'manager' 
          ? 'Review incoming workspace communications from team employees.' 
          : 'Direct private messaging portal to submit offline requests to management panels.'}
      </p>

      {/* CHAT THREAD CONTEXT CONTAINER */}
      <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', height: '300px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.sender === user.name ? 'flex-end' : 'flex-start', background: msg.sender === user.name ? 'var(--primary)' : '#e2e8f0', color: msg.sender === user.name ? 'white' : 'var(--text)', padding: '8px 14px', borderRadius: '12px', maxWidth: '75%', fontSize: '0.9rem' }}>
            <span style={{ fontSize: '0.75rem', display: 'block', fontWeight: 'bold', marginBottom: '2px', opacity: 0.8 }}>{msg.sender}</span>
            <p>{msg.text}</p>
            <span style={{ fontSize: '0.65rem', display: 'block', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>{msg.time}</span>
          </div>
        ))}
      </div>

      {/* FOOTER DISPATCH COMPONENT FORM */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
        <input type="text" className="form-control" style={{ padding: '0.6rem' }} placeholder="Type secure message entry string..." value={textInput} onChange={(e) => setTextInput(e.target.value)} required />
        <button type="submit" className="btn" style={{ width: 'auto', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
}

export default InboxTab;
