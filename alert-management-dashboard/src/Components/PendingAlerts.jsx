import React from 'react'

const PendingAlerts = ({ alerts, onAcknowledge, onResolve, onMarkUnactionable }) => (
  <div id="pending-section" className="pending-section">
    <div className="section-header right">
      <span className="pending-title">Pending Alerts</span>
      <span className="section-count">{alerts.length}</span>
    </div>
    <div className="pending-cards-container">
      {alerts.map(alert => (
        <div className="pending-alert-card" key={alert.id}>
          <div className="pending-message">{alert.message}</div>
          <div className="elapsed-bar-container">
            <div className="elapsed-label">Time Elapsed: {alert.elapsed} min</div>
            <div className="elapsed-bar-bg">
              <div
                className="elapsed-bar"
                style={{
                  width: `${Math.min(alert.elapsed, 10) / 10 * 100}%`
                }}
              />
            </div>
          </div>
          <div className="pending-actions pending-actions-column">
            <div className="pending-actions-row">
              <button className="acknowledge-btn" onClick={() => onAcknowledge(alert.id)}>
                Acknowledge
              </button>
              <button className="resolve-btn" onClick={() => onResolve(alert.id)}>
                Resolve
              </button>
            </div>
            <button className="unactionable-btn pending-unactionable-btn" onClick={() => onMarkUnactionable(alert, 'pending')}>
              Un-actionable
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default PendingAlerts