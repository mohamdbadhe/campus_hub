import React, { useState, useEffect } from 'react';

function App() {
  const [labs, setLabs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [issues, setIssues] = useState([]);

  // פונקציה למשיכת כל הנתונים מה-Backend
  const fetchData = () => {
    // US2: משיכת מעבדות
    fetch('http://127.0.0.1:8000/infrastructure/api/labs/')
      .then(res => res.json())
      .then(data => setLabs(data))
      .catch(err => console.error("Error fetching labs:", err));

    // US5: משיכת התראות קמפוס
    fetch('http://127.0.0.1:8000/infrastructure/api/alerts/')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Error fetching alerts:", err));

    // US7: משיכת תקלות לצוות תחזוקה
    fetch('http://127.0.0.1:8000/infrastructure/api/issues/')
      .then(res => res.json())
      .then(data => setIssues(data))
      .catch(err => console.error("Error fetching issues:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // US7: פונקציה לשינוי סטטוס תקלה (תוקן/לא תוקן)
  const toggleIssueStatus = (id) => {
    fetch(`http://127.0.0.1:8000/infrastructure/api/issues/update/${id}/`, {
      method: 'POST',
    })
    .then(res => res.json())
    .then(() => fetchData()) // רענון הנתונים לאחר העדכון
    .catch(err => console.error("Error updating issue:", err));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', direction: 'rtl' }}>
      <h1>מערכת ניהול תשתיות קמפוס</h1>

      {/* חלק 1: התראות קמפוס (US5) */}
      <section style={{ marginBottom: '30px' }}>
        <h2>📢 התראות קמפוס</h2>
        {alerts.length === 0 && <p>אין התראות פעילות.</p>}
        {alerts.map(alert => (
          <div key={alert.id} style={{
            backgroundColor: alert.alert_type === 'WARNING' ? '#fff3cd' : '#d1ecf1',
            border: '1px solid',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <strong>{alert.title}:</strong> {alert.message}
          </div>
        ))}
      </section>

      <hr />

      {/* חלק 2: רשימת מעבדות (US2) */}
      <section style={{ marginBottom: '30px' }}>
        <h2>🧪 מעבדות זמינות</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {labs.map(lab => (
            <div key={lab.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '200px' }}>
              <h3>{lab.name}</h3>
              <p>מיקום: {lab.location}</p>
              <p>קיבולת: {lab.capacity}</p>
              <p style={{ color: lab.is_available ? 'green' : 'red' }}>
                {lab.is_available ? '● פנוי' : '● תפוס'}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr />

      {/* חלק 3: לוח בקרה לתחזוקה (US7) */}
      <section>
        <h2>🛠️ לוח בקרה לצוות תחזוקה</h2>
        <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>מעבדה</th>
              <th>תיאור התקלה</th>
              <th>סטטוס</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id}>
                <td>{issue.lab__name}</td>
                <td>{issue.description}</td>
                <td style={{ color: issue.is_fixed ? 'green' : 'red' }}>
                  {issue.is_fixed ? 'תוקן' : 'בטיפול'}
                </td>
                <td>
                  <button onClick={() => toggleIssueStatus(issue.id)}>
                    שנה סטטוס
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;