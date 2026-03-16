import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mi-api-render-ghic.onrender.com';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    window.refreshUsers = fetchUsers;
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div style={styles.list}>
      <h2>Lista de Usuarios</h2>
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
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.nombre}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.edad}</td>
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
  }
};

export default UserList;