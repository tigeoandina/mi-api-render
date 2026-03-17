import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mi-api-backend-0ggv.onrender.com';

function UserList({ onUserUpdated }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', email: '', edad: '' });
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('❌ Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Exponer método para recargar desde el padre
  useEffect(() => {
    window.refreshUsers = fetchUsers;
  }, []);

  // Iniciar edición
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      nombre: user.nombre,
      email: user.email,
      edad: user.edad
    });
    setMessage('');
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ nombre: '', email: '', edad: '' });
  };

  // Actualizar formulario
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // Guardar cambios
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(`${API_URL}/api/users/${editingUser.id}`, editForm);
      setMessage('✅ Usuario actualizado exitosamente');
      setEditingUser(null);
      fetchUsers();
      if (onUserUpdated) onUserUpdated();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al actualizar: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      setMessage('✅ Usuario eliminado exitosamente');
      fetchUsers();
      if (onUserUpdated) onUserUpdated();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al eliminar: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div style={styles.list}>
      <h2>Lista de Usuarios</h2>
      
      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {users.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Edad</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                {editingUser && editingUser.id === user.id ? (
                  // Modo Edición
                  <>
                    <td style={styles.td}>{user.id}</td>
                    <td style={styles.td}>
                      <input
                        type="text"
                        name="nombre"
                        value={editForm.nombre}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        name="edad"
                        value={editForm.edad}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    </td>
                    <td style={styles.td}>
                      <button 
                        onClick={handleUpdate}
                        style={{...styles.btn, ...styles.btnSave}}
                      >
                        ✓ Guardar
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        style={{...styles.btn, ...styles.btnCancel}}
                      >
                        ✗ Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  // Modo Visualización
                  <>
                    <td style={styles.td}>{user.id}</td>
                    <td style={styles.td}>{user.nombre}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.edad}</td>
                    <td style={styles.td}>
                      <button 
                        onClick={() => handleEdit(user)}
                        style={{...styles.btn, ...styles.btnEdit}}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        style={{...styles.btn, ...styles.btnDelete}}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  list: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#0070f3',
    color: 'white',
    padding: '12px',
    textAlign: 'left'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd'
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f5f5f5'
    }
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #0070f3',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  btn: {
    padding: '6px 12px',
    margin: '0 4px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  btnEdit: {
    backgroundColor: '#ffc107',
    color: '#000'
  },
  btnDelete: {
    backgroundColor: '#dc3545',
    color: '#fff'
  },
  btnSave: {
    backgroundColor: '#28a745',
    color: '#fff'
  },
  btnCancel: {
    backgroundColor: '#6c757d',
    color: '#fff'
  },
  message: {
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '4px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  }
};

export default UserList;