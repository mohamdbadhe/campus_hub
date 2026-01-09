import React, { useState, useEffect } from 'react';

function App() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // פונקציה למשיכת הנתונים מה-API (US7)
  const fetchIssues = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/infrastructure/api/issues/')
      .then((res) => res.json())
      .then((data) => {
        setIssues(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching issues:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // פונקציה לעדכון סטטוס תקלה (US7 - Toggle)
  const toggleStatus = (id) => {
    fetch(`http://127.0.0.1:8000/infrastructure/api/issues/update/${id}/`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          // עדכון ה-State המקומי כדי שהשינוי יראה מיד בעין
          setIssues(issues.map(iss => 
            iss.id === id ? { ...iss, is_fixed: data.is_fixed } : iss
          ));
        }
      })
      .catch((err) => console.error("Error updating issue:", err));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🛠️ Maintenance Control Center</h1>
        <p style={styles.subtitle}>Campus Infrastructure Management | US7 Dashboard</p>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Reported Issues</h2>
            <button onClick={fetchIssues} style={styles.refreshBtn}>🔄 Refresh</button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading data...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Lab / Location</th>
                  <th style={styles.th}>Issue Description</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} style={styles.tr}>
                    <td style={styles.td}><strong>{issue.lab__name}</strong></td>
                    <td style={{ ...styles.td, color: issue.is_fixed ? '#95a5a6' : '#2c3e50' }}>
                      {issue.description}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: issue.is_fixed ? '#27ae60' : '#e74c3c'
                      }}>
                        {issue.is_fixed ? 'Fixed' : 'Pending'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button 
                        onClick={() => toggleStatus(issue.id)}
                        style={{
                          ...styles.actionBtn,
                          backgroundColor: issue.is_fixed ? '#f39c12' : '#2980b9'
                        }}
                      >
                        {issue.is_fixed ? 'Reopen' : 'Mark as Fixed'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {issues.length === 0 && !loading && (
            <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>No issues reported yet. Good job!</p>
          )}
        </div>
      </main>
    </div>
  );
}

// עיצובים (CSS-in-JS) שייצרו את אפקט ה-"וואו"
const styles = {
  container: {
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    padding: '40px 20px',
    color: '#2c3e50',
    direction: 'ltr', // לוח בקרה טכני בדרך כלל באנגלית
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0',
    color: '#2c3e50',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    border: '1px solid #e1e4e8',
  },
  cardHeader: {
    padding: '20px 30px',
    borderBottom: '2px solid #f0f2f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafbfc',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#34495e',
  },
  refreshBtn: {
    padding: '8px 15px',
    borderRadius: '8px',
    border: '1px solid #d1d4d7',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f8f9fa',
    textAlign: 'left',
  },
  th: {
    padding: '15px 20px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    fontSize: '0.85rem',
    letterSpacing: '1px',
  },
  tr: {
    borderBottom: '1px solid #f0f2f5',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '15px 20px',
    fontSize: '1rem',
  },
  statusBadge: {
    color: 'white',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  actionBtn: {
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.1s, opacity 0.2s',
  }
};

export default App;