import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://mi-api-render-ghic.onrender.com';

function UserForm({ onUserCreated }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/api/users`, formData);
      setMessage('✅ Usuario creado exitosamente');
      setFormData({ nombre: '', email: '', edad: '' });
      onUserCreated();
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.error || 'No se pudo crear'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.form}>
      <h2>Crear Nuevo Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={formData.edad}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  form: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  button: {
    backgroundColor: '#0070f3',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%'
  },
  message: {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '4px'
  }
};

export default UserForm;