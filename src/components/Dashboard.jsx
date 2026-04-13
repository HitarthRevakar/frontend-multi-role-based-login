import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (user?.role === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="glass-panel dashboard-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h1 className="title" style={{ margin: 0 }}>Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }}>
          Logout
        </button>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '28px', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          Welcome back, <span style={{ color: '#2563eb' }}>{user?.name}</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '35px', margin: '0 0 35px 0' }}>
          Here is an overview of your current user workspace.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Action Card */}
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px',
            padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f172a' }}>Task Management</h3>
              <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
                View assigned tasks, update their status, or create new goals based on your active permissions.
              </p>
            </div>
            <button 
              className="btn" 
              style={{ width: '100%', padding: '10px 0', fontWeight: '600', borderRadius: '6px' }}
              onClick={() => navigate('/tasks')}
            >
              Open Workspace
            </button>
          </div>

          {/* Profile Card */}
          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px',
            padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            display: 'flex', flexDirection: 'column'
          }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="20" height="20" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </div>
             <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: '#0f172a' }}>Account Details</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                 <span style={{ color: '#64748b', fontSize: '14px' }}>Email Address</span>
                 <span style={{ color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>{user?.email}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                 <span style={{ color: '#64748b', fontSize: '14px' }}>Access Level</span>
                 <span style={{ color: '#0f172a', fontWeight: '500', fontSize: '14px', textTransform: 'capitalize' }}>{user?.role}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: '#64748b', fontSize: '14px' }}>Account Status</span>
                 <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <span style={{width:'8px', height:'8px', borderRadius:'50%', background:'#16a34a'}}></span> Active
                 </span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
