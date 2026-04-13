import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TaskBoard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');

  // Fetch permissions for UI display toggles
  const fetchPermissions = async () => {
    try {
      if (user.role === 'admin') {
        // God mode mock
        setPermissions(['tasks:read', 'tasks:create', 'tasks:update', 'tasks:delete']);
        return;
      }
      const response = await api.get(`/users/${user.id}/permissions`);
      const granted = response.data.filter(p => p.granted).map(p => p.name);
      setPermissions(granted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You do not have permission to view tasks.');
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchPermissions();
      await fetchTasks();
    };
    loadData();
  }, []);

  // Helpers to check permission smoothly
  const can = (action) => permissions.includes(action);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await api.post('/tasks', { title: newTaskTitle });
      setNewTaskTitle('');
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  return (
    <div className="glass-panel dashboard-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 className="title" style={{ margin: 0 }}>Task Management</h1>
        <button style={{ padding: '8px 16px', width: 'auto'}} className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {error ? (
        <div style={{ padding: '20px', background: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          {error}
        </div>
      ) : (
        <>
          {/* Create Task Form */}
          {can('tasks:create') && (
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{ flex: '1', minWidth: '200px' }}
              />
              <button 
                type="submit" 
                className="btn" 
                style={{ 
                  width: '150px', 
                  minWidth: '100px',
                  opacity: !newTaskTitle.trim() ? 0.5 : 1,
                  cursor: !newTaskTitle.trim() ? 'not-allowed' : 'pointer'
                }}
                disabled={!newTaskTitle.trim()}
              >
                Add Task
              </button>
            </form>
          )}

          {/* Task List */}
          {can('tasks:read') && (
             <div style={{ overflowX: 'auto' }}>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr><td colSpan="4" style={{textAlign: 'center'}}>No tasks available.</td></tr>
                  ) : (
                    tasks.map((t, index) => (
                      <tr key={t.id}>
                        <td>{index + 1}</td>
                        <td style={{ width: '50%' }}>{t.title}</td>
                        <td>
                          {can('tasks:update') ? (
                            <select 
                              value={t.status} 
                              onChange={(e) => handleStatusChange(t.id, e.target.value)}
                              style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--border)' }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          ) : (
                            <span style={{ fontWeight: 'bold' }}>{t.status}</span>
                          )}
                        </td>
                        <td>
                          {can('tasks:delete') ? (
                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '13px', width: 'auto' }} onClick={() => handleDelete(t.id)}>
                              Delete
                            </button>
                          ) : (
                            <span style={{ color: '#999', fontSize: '12px' }}>Locked</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskBoard;
