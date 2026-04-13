import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // Permissions Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);

  // Create User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      if (id === user.id && currentStatus) {
        alert("You cannot deactivate your own account.");
        return;
      }
      await api.put(`/users/${id}/status`, { is_active: !currentStatus });
      fetchUsers(); // refresh data
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // --- Permissions Management --- //

  const openPermissionsModal = async (u) => {
    setSelectedUser(u);
    setLoadingPerms(true);
    try {
      const res = await api.get(`/users/${u.id}/permissions`);
      setPermissions(res.data);
    } catch (err) {
      alert("Failed to load permissions");
    } finally {
      setLoadingPerms(false);
    }
  };

  const togglePermissionCheckbox = (permId) => {
    setPermissions(permissions.map(p => 
      p.id === permId ? { ...p, granted: !p.granted } : p
    ));
  };

  const savePermissions = async () => {
    try {
      const grantedIds = permissions.filter(p => p.granted).map(p => p.id);
      await api.post(`/users/${selectedUser.id}/permissions`, { permissionIds: grantedIds });
      toast.success("Permissions updated successfully!");
      setSelectedUser(null);
    } catch(err) {
      toast.error("Failed to save permissions.");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return toast.error("Please fill in all fields.");
    try {
      await api.post('/users', { name: newName, email: newEmail, password: newPassword, role: 'user' });
      toast.success("User successfully created!");
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setShowAddUserModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user.");
    }
  }

  return (
    <div className="glass-panel dashboard-panel" style={{position: 'relative'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 className="title" style={{ margin: 0, textAlign: 'left' }}>Admin Panel</h1>
          <p style={{ margin: '5px 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowAddUserModal(true)} className="btn" style={{ width: 'auto', padding: '8px 16px' }}>
            + Create New User
          </button>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }}>
            Logout
          </button>
        </div>
      </div>
      
      {error && <div className="error-msg">{error}</div>}



      <div style={{ overflowX: 'auto' }}>
        <table className="user-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No other users found in the system.
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                <td>
                  <span className={`status-badge ${u.is_active ? 'status-active' : 'status-inactive'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex', gap:'8px'}}>
                    <button 
                      className={`btn ${u.is_active ? 'btn-danger' : ''}`}
                      style={{ padding: '4px 8px', fontSize: '13px', width: 'auto' }}
                      onClick={() => toggleStatus(u.id, u.is_active)}
                      disabled={u.id === user.id}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    {u.role === 'user' && ( /* Only manage permissions for standard users */
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '13px', width: 'auto' }}
                        onClick={() => openPermissionsModal(u)}
                      >
                        Permissions
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permissions Modal Overlay */}
      {selectedUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="glass-panel" style={{ width: '350px', background: '#fff' }}>
            <h3>Permissions: {selectedUser.name}</h3>
            {loadingPerms ? (
              <p>Loading...</p>
            ) : (
              <div style={{ margin: '20px 0' }}>
                {permissions.map(p => (
                  <div key={p.id} style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={p.granted} 
                        onChange={() => togglePermissionCheckbox(p.id)}
                        style={{ marginRight: '10px' }}
                      />
                      <div>
                        <strong>{p.description}</strong>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)} style={{width:'auto'}}>Cancel</button>
              <button className="btn" onClick={savePermissions} style={{width:'auto'}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal Overlay */}
      {showAddUserModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="glass-panel" style={{ width: '350px', background: '#fff' }}>
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <input 
                type="text" className="input-field" placeholder="Full Name" 
                value={newName} onChange={e => setNewName(e.target.value)} 
                required
              />
              <input 
                type="email" className="input-field" placeholder="Email Address" 
                value={newEmail} onChange={e => setNewEmail(e.target.value)} 
                required
              />
              <input 
                type="password" className="input-field" placeholder="Secure Password" 
                value={newPassword} onChange={e => setNewPassword(e.target.value)} 
                required minLength={6}
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)} style={{width:'auto'}}>Cancel</button>
                <button type="submit" className="btn" style={{width:'auto'}}>Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
