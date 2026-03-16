import UserForm from './components/UserForm';
import UserList from './components/UserList';

function App() {
  const handleUserCreated = () => {
    if (window.refreshUsers) {
      window.refreshUsers();
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🚀 Mi API con React</h1>
        <p>Frontend + Backend + PostgreSQL en Render.com</p>
      </header>
      <main style={styles.main}>
        <UserForm onUserCreated={handleUserCreated} />
        <UserList />
      </main>
      <footer style={styles.footer}>
        <p>Desarrollado por David Mamani © 2026</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#eaeaea',
    padding: '20px'
  },
  header: {
    backgroundColor: '#0070f3',
    color: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    color: '#666'
  }
};

export default App;