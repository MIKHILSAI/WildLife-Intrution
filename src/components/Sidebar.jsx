import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Video, Activity, Eye, BarChart3, Bell, Settings, HelpCircle, Leaf } from 'lucide-react';

export default function Sidebar({ systemState }) {
  const navStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    color: isActive ? 'var(--primary)' : 'var(--on-surface)',
    backgroundColor: isActive ? 'var(--primary-container)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    borderRight: isActive ? '4px solid var(--primary)' : '4px solid transparent',
    transition: 'all 0.2s',
    marginBottom: '0.25rem'
  });

  return (
    <div style={{ width: '260px', borderRight: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface)' }}>
      <div style={{ padding: '2rem 1.5rem', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf className="text-primary" size={24} /> Namma Payir
        </h1>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Living Laboratory</p>
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink to="/overview" style={navStyle}> <LayoutDashboard size={20} /> System Overview </NavLink>
        <NavLink to="/live" style={navStyle}> <Video size={20} /> Live Monitor </NavLink>
        <NavLink to="/hardware" style={navStyle}> <Activity size={20} /> Hardware Data </NavLink>
        <NavLink to="/vision" style={navStyle}> <Eye size={20} /> AI Vision </NavLink>
        <NavLink to="/analytics" style={navStyle}> <BarChart3 size={20} /> Analytics </NavLink>
        <NavLink to="/alerts" style={navStyle}> <Bell size={20} /> Alert Center </NavLink>
      </nav>

      <div style={{ padding: '1.5rem' }}>
        <div 
          onClick={() => alert("Dispatching local support technician to field perimeter...")}
          style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold' }}
        >
          Support Field
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/settings" style={{ display: 'flex', gap: '0.5rem', color: 'var(--on-surface-variant)', textDecoration: 'none' }}><Settings size={18} /> Settings</NavLink>
          <div onClick={() => alert("Connecting to Cloud Knowledge Base...")} style={{ display: 'flex', gap: '0.5rem', color: 'var(--on-surface-variant)', cursor:'pointer' }}><HelpCircle size={18} /> Support</div>
        </div>
      </div>
    </div>
  );
}
