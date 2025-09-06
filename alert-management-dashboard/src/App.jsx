import { useState, useEffect } from 'react'
import './App.css'
import PendingAlerts from './Components/PendingAlerts'
import AcknowledgedAlerts from './Components/AcknowledgedAlerts'
import ResolvedAlerts from './Components/ResolvedAlerts'
import OverdueAlerts from './Components/OverdueAlerts'
import UnactionableAlerts from './Components/UnactionableAlerts'

const alertTypes = [
  { name: 'Total Alerts', key: 'total', color: '#4F8A8B' },
  { name: 'Pending', key: 'pending', color: '#F9A826' },
  { name: 'Overdue', key: 'overdue', color: '#FF6363' },
  { name: 'Acknowledged', key: 'acknowledged', color: '#43D9AD' },
  { name: 'Resolved', key: 'resolved', color: '#3A4750' },
  { name: 'Un-actionable', key: 'unactionable', color: '#4F8A8B' }, // Added
]

// Dummy acknowledged alerts data
const acknowledgedAlertsData = [
  { id: 4, message: 'Alert acknowledged. Awaiting resolution.', elapsed: 40 },
  { id: 5, message: 'Alert acknowledged. Awaiting resolution.', elapsed: 20 },
]

const resolvedAlertsData = [
  { id: 6, message: 'Alert resolved successfully.', elapsed: 70 },
  { id: 7, message: 'Alert resolved successfully.', elapsed: 120 },
]

const overdueAlertsData = [
  { id: 8, message: 'Alert overdue! Immediate action required.', elapsed: 90 },
  { id: 9, message: 'Alert overdue! Immediate action required.', elapsed: 150 },
]

function App() {
  const [pendingAlerts, setPendingAlerts] = useState([])
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(acknowledgedAlertsData)
  const [resolvedAlerts, setResolvedAlerts] = useState(resolvedAlertsData)
  const [overdueAlerts, setOverdueAlerts] = useState(overdueAlertsData)
  const [unactionableAlerts, setUnactionableAlerts] = useState([])

 
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/alerts/stream');
    eventSource.addEventListener('PENDING', (event) => {
      const data = JSON.parse(event.data);
      handleAlertEvent(data);
    });
    eventSource.addEventListener('NON_ACTIONABLE', (event) => {
      const data = JSON.parse(event.data);
      handleAlertEvent(data);
    });
    eventSource.addEventListener('CHANGE_RELATED', (event) => {
      const data = JSON.parse(event.data);
      handleAlertEvent(data);
    });
    eventSource.onerror = () => {
      eventSource.close();
    };
    return () => eventSource.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPendingAlerts(prevPending => {
        const now = Date.now();
        const stillPending = [];
        const toOverdue = [];
        prevPending.forEach(alert => {
          const age = now - (alert.createdAt || now);
          if (age >= 600000) { // 10 minutes in ms
            toOverdue.push({ ...alert, elapsed: Math.floor(age / 60000) });
          } else {
            stillPending.push({ ...alert, elapsed: Math.floor(age / 60000) });
          }
        });
        if (toOverdue.length > 0) {
          setOverdueAlerts(prev => [...prev, ...toOverdue]);
        }
        return stillPending;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleAlertEvent = (event) => {
    const { type, id, payload } = event;
    const alert = {
      id,
      message: payload.subject || 'No subject',
      from: payload.from,
      dateReceived: payload.dateReceived,
      application: payload.application,
      shift: payload.shift,
      elapsed: 0,
      createdAt: Date.now()
    };

    if (type == "PENDING") {
      setPendingAlerts(prev => [...prev, alert]);
    } else if (type == "NON_ACTIONABLE") {
      setUnactionableAlerts(prev => [...prev, alert]);
    } else if (type =="CHANGE_RELATED") {
      setAcknowledgedAlerts(prev => [...prev, alert]);
    }
  };

  // Dynamically calculate total alerts
  const alerts = {
    total: pendingAlerts.length + acknowledgedAlerts.length + resolvedAlerts.length + overdueAlerts.length + unactionableAlerts.length,
    pending: pendingAlerts.length,
    acknowledged: acknowledgedAlerts.length,
    resolved: resolvedAlerts.length,
    overdue: overdueAlerts.length,
    unactionable: unactionableAlerts.length,
  }

  // Add mock alert handler
  const handleAddMockAlert = () => {
    const newId = pendingAlerts.length + acknowledgedAlerts.length + resolvedAlerts.length + overdueAlerts.length + unactionableAlerts.length + 1
    setPendingAlerts(prev => [
      ...prev,
      {
        id: newId,
        message: 'A new alert has been detected and requires attention.',
        elapsed: 0,
        createdAt: Date.now()
      }
    ])
  }

  
  const handleAcknowledge = (id) => {
    const alert = pendingAlerts.find(a => a.id === id);
    if (!alert) return;
    setAcknowledgedAlerts(prev => [...prev, alert]);
    setPendingAlerts(prev => prev.filter(a => a.id !== id));
};

  const handleResolve = (id) => {
    const alert = pendingAlerts.find(a => a.id === id);
    if (!alert) return;
    setResolvedAlerts(prev => [...prev, alert]);
    setPendingAlerts(prev => prev.filter(a => a.id !== id));
  }

  const handleResolveAcknowledged = (id) => {
    setAcknowledgedAlerts(prev => prev.filter(alert => alert.id !== id))
    setAlerts(prev => ({
      ...prev,
      acknowledged: prev.acknowledged - 1,
      resolved: prev.resolved + 1,
    }))
  }

  const handleRemind = (id) => {
    alert('Reminder sent for alert ID: ' + id)
  }

  const handleViewDetails = (id) => {
    alert('Viewing details for resolved alert ID: ' + id)
  }

  const handleMarkUnactionable = (alert, type) => {
    if (type === 'pending') {
      setPendingAlerts(prev => prev.filter(a => a.id !== alert.id))
    } else if (type === 'overdue') {
      setOverdueAlerts(prev => prev.filter(a => a.id !== alert.id))
    }
    setUnactionableAlerts(prev => [...prev, { ...alert, message: 'Marked as Un-actionable. No action required.' }])
  }

  
  const scrollToSection = (key) => {
    const section = document.getElementById(`${key}-section`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard-bg">
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo">🚨 Alert Chaser</span>
          <span className="subtitle">Monitor & Track Alert Response Times</span>
        </div>
        <button className="mock-alert-btn" onClick={handleAddMockAlert}>
          + Add Mock Alert
        </button>
      </nav>
      <div className="cards-container">
        {alertTypes.map(type => (
          <div
            className="alert-card"
            style={{ borderColor: type.color, cursor: 'pointer' }}
            key={type.key}
            onClick={() => scrollToSection(type.key)}
            title={`Go to ${type.name}`}
          >
            <div className="card-title">{type.name}</div>
            <div className="card-count" style={{ color: type.color }}>{alerts[type.key]}</div>
          </div>
        ))}
      </div>
      <PendingAlerts
        alerts={pendingAlerts}
        onAcknowledge={handleAcknowledge}
        onResolve={handleResolve}
        onMarkUnactionable={handleMarkUnactionable}
      />
      <AcknowledgedAlerts
        alerts={acknowledgedAlerts}
        onResolve={handleResolveAcknowledged}
      />
      <ResolvedAlerts
        alerts={resolvedAlerts}
        onViewDetails={handleViewDetails}
      />
      <OverdueAlerts
        alerts={overdueAlerts}
        onRemind={handleRemind}
        onMarkUnactionable={handleMarkUnactionable}
      />
      <UnactionableAlerts
        alerts={unactionableAlerts}
      />
    </div>
  )
}

export default App
